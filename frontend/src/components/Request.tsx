import React from "react";
import { StoredRequest } from "../types";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import { RequestBody } from "./index";

interface RequestProps {
	request: StoredRequest
}

dayjs.extend(RelativeTime);

const Request = ({ request }: RequestProps) => {
	const url = new URL(request.url);

	const methodColours: {[key: string]: string} = {
		GET: "bg-purple-500",
		POST: "bg-blue-500",
		DELETE: "bg-red-500",
		fallback: "bg-yellow-600"
	};

	return (
		<div className="p-3 rounded-lg bg-black/10 border-2 border-white/25 w-full flex gap-y-4 flex-col">
			<div className="flex gap-2 items-center justify-between">
				<div className="flex gap-2 items-center">
					<span className={`px-2 font-bold rounded-md uppercase text-white ${methodColours[request.method] ?? methodColours.fallback}`}>
						{request.method}
					</span>
					<span className="font-bold font-mono text-white">
						{request.ip}
					</span>
				</div>
				<p className="text-white">
					<span className="font-bold">{dayjs(request.timestamp).format("DD MMM YYYY, HH:mm:ss.SSS")}</span>{" "}
					({dayjs(request.timestamp).fromNow()})
				</p>
			</div>
			{request.body && request.body.length > 0 && <RequestBody body={request.body} type={request.headers["content-type"]} />}
			<div>
				<h4 className="text-white text-xl font-bold">URL</h4>
				<p className="text-white text-sm font-bold">Host: <span className="text-pink-500 font-mono">{url.host}</span></p>
				<p className="text-white text-sm font-bold">Path: <span className="text-pink-500 font-mono">{url.pathname}</span></p>
				{url.search && <p className="text-white text-sm font-bold">Query String: <span className="text-pink-500 font-mono">{url.search}</span></p>}
			</div>s
			<div>
				<h4 className="text-white text-xl font-bold">Headers</h4>
				<table className="w-full">
					<tbody>
						{Object.keys(request.headers).map(key =>
							<tr key={key} className="border-b last:border-0 border-white/25">
								<td className="w-96 p-1 align-top text-white font-bold text-sm" key={key}>{key}</td>
								<td className="p-1 align-top text-pink-500 text-sm font-mono">{request.headers[key]}</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Request;
