import { IHTTPMethods, Router, Request as IttyRequest } from "itty-router";
import { randomString, json } from "./utils";
import { RequestBin, StoredRequest } from "./types";

// TODO: Expiring Bins?

const router = Router<Request, IHTTPMethods>();

// Create a request bin
router.post("/create", async () => {
	const id = randomString(10);

	const data: RequestBin = {
		id: id,
		requests: {}
	};

	await BINS.put(id, JSON.stringify(data));

	return json({
		success: true,
		bin: {
			id
		}
	});
});

// Get a request bin (and it's requests)
router.get("/:id", async ({ params }) => {
	const { id } = params;
	const bin = await BINS.get<RequestBin>(id, { type: "json" });

	if (!bin) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	return json({
		success: true,
		bin
	});
});

// Add to request bin
router.all("/-/:id", async (request: Request & IttyRequest) => {
	const { params, method, headers, url } = request;
	const { id } = params;
	const bin = await BINS.get<RequestBin>(id, { type: "json" });

	if (!bin) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	const headersObject = {};
	let ip = "";

	for (const [key, value] of headers) {
		headersObject[key] = value;

		if (key === "cf-connecting-ip")
			ip = value;
	}

	const requestId = randomString(10);
	const r: StoredRequest = {
		id: requestId,
		ip,
		method,
		url,
		timestamp: Date.now(),
		headers: headersObject
	};

	const body = await request.text();

	if (body)
		r.body = body;

	bin.requests[requestId] = r;

	await BINS.put(id, JSON.stringify(bin));

	return json({ success: true });
});

// Get single request from bin
router.get("/:id/:requestId", async ({ params }) => {
	const { id, requestId } = params;
	const bin = await BINS.get<RequestBin>(id, { type: "json" });

	if (!bin) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	const request = bin.requests[requestId];

	if (!request) {
		return json({
			success: false,
			message: "A request could not be found in this bin with the ID provided"
		}, { status: 404 });
	}

	return json({ success: true, request });
});

// Delete all requests from a bin
router.delete("/:id/all", async ({ params }) => {
	const { id } = params;
	const bin = await BINS.get<RequestBin>(id, { type: "json" });

	if (!bin) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	bin.requests = {};

	await BINS.put(id, JSON.stringify(bin));

	return json({ success: true });
});

// Delete a single request from a bin
router.delete("/:id/:requestId", async ({ params }) => {
	const { id, requestId } = params;
	const bin = await BINS.get<RequestBin>(id, { type: "json" });

	if (!bin) {
		return json({
			success: false,
			message: "A request bin could not be found with the ID provided"
		}, { status: 404 });
	}

	delete bin.requests[requestId];

	await BINS.put(id, JSON.stringify(bin));

	return json({ success: true });
});

// Fallback 404 handler
router.all("*", () => json({ success: false, message: "Endpoint not found" }, { status: 404 }));

addEventListener("fetch", event =>
	event.respondWith(router
		.handle(event.request)
		.catch(error => {
			console.error(error);

			return json({ success: false, message: "An unknown error occurred" }, { status: 500 });
		})
	)
);
