import React from "react";
import { CodeBlock } from "./index";

interface RequestBodyProps {
	body: string
	type: string,
	bin: string,
	request: string
}

const RequestBody = ({ body, type, bin, request }: RequestBodyProps) => {
	let formattedBody: React.ReactNode;

	if (type.startsWith("application/json"))
		formattedBody = <CodeBlock code={body} lang="json"/>;
	else if (type.startsWith("application/x-www-form-urlencoded")) {
		const params = Object.fromEntries(new URLSearchParams(body));

		formattedBody = <div className="border-l-4 border-white/25 mt-1 pl-2">
			{Object.keys(params).map(key =>
				<p key={key} className="text-white text-sm font-bold">
					<span>{key}: </span>
					<span className="text-pink-500 font-mono">{params[key]}</span>
				</p>
			)}
		</div>;
	} else
		formattedBody = <CodeBlock code={body} />;

	return (
		<div>
			<h4 className="text-white text-xl font-bold">Body</h4>
			{formattedBody}
		</div>
	);
};

export default RequestBody;
