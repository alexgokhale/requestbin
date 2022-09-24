import React from "react";
import { CodeBlock } from "./index";

interface RequestBodyProps {
	body: number[]
	type: string
}

const RequestBody = ({ body, type }: RequestBodyProps) => {
	let formattedBody: React.ReactNode;

	const textDecoder = new TextDecoder();
	const stringBody = textDecoder.decode(Uint8Array.from(body).buffer);

	if (type.startsWith("application/json"))
		formattedBody = <CodeBlock code={stringBody} lang="json"/>;
	else if (type.startsWith("application/x-www-form-urlencoded")) {
		const params = Object.fromEntries(new URLSearchParams(stringBody));

		formattedBody = <div className="border-l-4 border-white/25 mt-1 pl-2">
			{Object.keys(params).map(key =>
				<p key={key} className="text-white text-sm font-bold">
					<span>{key}: </span>
					<span className="text-pink-500 font-mono">{params[key]}</span>
				</p>
			)}
		</div>;
	} else if (type.startsWith("image/")) {
		const output = [];

		for (let i = 0; i < body.length; i++)
			output.push(String.fromCharCode(body[i]));

		const base64 = btoa(output.join(""));

		formattedBody = <div className="bg-black/10 rounded-lg p-2 mt-3">
			<img
				alt="body image" className="w-32 h-32"
				src={`data:${type};base64,${base64}`}
			/>
		</div>;
	} else
		formattedBody = <CodeBlock code={stringBody} />;

	return (
		<div>
			<h4 className="text-white text-xl font-bold">Body</h4>
			{formattedBody}
		</div>
	);
};

export default RequestBody;
