import { Router, IRequest } from "itty-router";
import { StoredRequest, RequestBin, ReturnedRequest } from "./types";
import { mapRequest, randomString, json } from "./utils";

export interface Env {
	DB: D1Database;
}

const router = Router<IRequest, [env: Env, ctx: ExecutionContext]>();

router.post("/create", async (req, env: Env) => {
	const id = randomString(10);

	const result = await env.DB.prepare("INSERT INTO bins (id) values (?)").bind(id).run();

	if (!result.success) {
		return json({
			success: false,
			message: "An unknown error occurred"
		}, { status: 500 });
	}

	return json({
		success: true,
		bin: {
			id
		}
	});
});
router.all("/-/:id/*", async (request, env: Env) => {
	const { params, method, headers, url } = request;
	const { id } = params;

	const result = await env.DB.prepare("SELECT * FROM bins WHERE id = ?").bind(id).first<string>("id");

	if (!result) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	const headersObject: {[k: string]: string} = {};
	let ip = "";

	for (const [key, value] of headers) {
		headersObject[key] = value;

		if (key === "cf-connecting-ip")
			ip = value;
	}

	const requestId = randomString(10);
	const body = await request.arrayBuffer();

	const insertResult = await env.DB
		.prepare("INSERT INTO requests (id, ip, method, url, timestamp, headers, body, bin_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
		.bind(requestId, ip, method, url, Date.now(), JSON.stringify(headersObject), body, id)
		.run();

	if (!insertResult.success) {
		return json({
			success: false,
			message: "An unknown error occurred"
		}, { status: 500 });
	}

	return json({ success: true });
});
router.delete("/:id", async ({ params }, env: Env) => {
	const { id } = params;

	let result = await env.DB.prepare("DELETE FROM requests WHERE bin_id = ?").bind(id).run();

	if (!result.success) {
		return json({
			success: false,
			message: "An unknown error occurred"
		}, { status: 500 });
	}

	result = await env.DB.prepare("DELETE FROM bins WHERE id = ?").bind(id).run();

	if (!result.success) {
		return json({
			success: false,
			message: "An unknown error occurred"
		}, { status: 500 });
	}

	return json({ success: true });
});
router.delete("/:id/all", async ({ params }, env: Env) => {
	const { id } = params;

	const binResult = await env.DB.prepare("SELECT * FROM bins WHERE id = ?").bind(id).first<string>("id");

	if (!binResult) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	const result = await env.DB.prepare("DELETE FROM requests WHERE bin_id = ?").bind(id).run();

	if (!result.success) {
		return json({
			success: false,
			message: "An unknown error occurred"
		}, { status: 500 });
	}

	return json({ success: true });
});
router.delete("/:id/:requestId", async ({ params }, env: Env) => {
	const { id, requestId } = params;

	const binResult = await env.DB.prepare("SELECT * FROM bins WHERE id = ?").bind(id).first<string>("id");

	if (!binResult) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	const result = await env.DB.prepare("DELETE FROM requests WHERE bin_id = ? AND id = ?").bind(id, requestId).run();

	if (!result.success) {
		return json({
			success: false,
			message: "An unknown error occurred"
		}, { status: 500 });
	}

	return json({ success: true });
});
router.get("/:id", async ({ params }, env: Env) => {
	const { id } = params;

	const result = await env.DB.prepare("SELECT * FROM bins WHERE id = ?").bind(id).first<string>("id");

	if (!result) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	const requestsResult = await env.DB.prepare("SELECT * FROM requests WHERE bin_id = ?").bind(id).all<StoredRequest>();

	if (!requestsResult.success) {
		return json({
			success: false,
			message: "An unknown error occurred"
		}, { status: 500 });
	}

	const requestMap: {[key: string]: ReturnedRequest} = {};

	for (const r of requestsResult.results)
		requestMap[r.id] = mapRequest(r);

	return json({
		success: true,
		bin: <RequestBin>{
			id,
			requests: requestMap
		}
	});
});
router.get("/:id/:requestId", async ({ params }, env: Env) => {
	const { id, requestId } = params;

	const result = await env.DB.prepare("SELECT * FROM bins WHERE id = ?").bind(id).first<string>("id");

	if (!result) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	const request = await env.DB.prepare("SELECT * FROM requests WHERE bin_id = ? AND id = ?").bind(id, requestId).first<StoredRequest>();

	if (!request) {
		return json({
			success: false,
			message: "A request could not be found in this bin with the ID provided"
		}, { status: 404 });
	}

	return json({ success: true, request: mapRequest(request) });
});
router.all("*", () => {
	return json({ success: false, message: "Endpoint not found" }, { status: 404 });
});

export default {
	fetch(req: Request, env: Env, ctx: ExecutionContext) {
		return router.handle(req, env, ctx).catch(e => {
			console.error(e);

			return json({
				success: false,
				message: "An unknown error occurred"
			}, { status: 500 });
		});
	}
};
