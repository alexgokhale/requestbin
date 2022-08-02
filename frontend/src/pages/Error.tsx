import React from "react";
import { Link } from "react-router-dom";
import { Header } from "../components";

interface ErrorProps {
	code: number,
	message?: string
}

const Error = (props: ErrorProps) => {
	const { code, message } = props;

	let defaultMessage: string;

	switch (code) {
		case 404:
			defaultMessage = "The requested resource could not be found";
			break;
		case 401 || 403:
			defaultMessage = "You don't have permission to access this resource";
			break;
		default:
			defaultMessage = "An unknown error occurred";
			break;
	}

	return (
		<div className="m-8 select-none">
			<Header />

			<div className="mt-8">
				<pre className="font-mono text-red-500 font-bold">
					Code:    {code}
				</pre>
				<pre className="font-mono text-red-500 font-bold">
					Message: {message ? message : defaultMessage}
				</pre>
			</div>

			<div className="mt-8 flex gap-4">
				<Link
					className="font-mono font-bold text-cyan-600 underline cursor-pointer"
					to="/"
				>
					Go to Homepage.
				</Link>
				<a
					className="font-mono font-bold text-cyan-600 underline cursor-pointer"
					href="mailto:requestbin@alexgokhale.com"
				>
					Report an Issue.
				</a>
			</div>
		</div>
	);
};

export default Error;
