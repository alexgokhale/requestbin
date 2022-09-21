import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header, Spinner, Request } from "../components";
import { Error } from "../pages";
import { RequestBin, RequestBinResponse } from "../types";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";

const Bin = () => {
	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<number | null>(null);
	const [bin, setBin] = useState<RequestBin | null>(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);

				const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${id}`);
				const body = await response.json() as RequestBinResponse;

				if (response.ok)
					setBin(body.bin);
				else
					setError(response.status);

				setLoading(false);
			} catch (_) {
				setError(500);
				setLoading(false);
			}
		})();
	}, [id]);

	if (error) {
		if (error === 404) {
			return (
				<Error code={404} message="A request bin could not be found with the ID provided"/>
			);
		}

		return (
			<Error code={error} />
		);
	}

	return (
		<div className="m-8">
			<Header row={loading ? <Spinner /> : <p className="font-mono text-pink-500 font-bold select-none">
				Your RequestBin endpoint:{" "}
				<span className="font-mono select-all rounded-lg p-1 px-2 bg-black/25 text-neutral-300">
					{process.env.REACT_APP_BASE_API_URL}/-/{id}
				</span>
			</p>} />
			{!loading && bin && (
				Object.keys(bin.requests).length === 0 ? (
					<div className="flex mt-8 gap-2">
						<QuestionMarkCircleIcon className="h-6 w-6 text-white" />
						<p className="font-bold text-white">No Requests Found</p>
					</div>
				) : (
					<div className="flex gap-4 mt-8 flex-col">
						{Object
							.keys(bin.requests)
							.sort((a, b) => bin.requests[a].timestamp > bin.requests[b].timestamp ? -1 : 1)
							.map(requestId => <Request key={requestId} request={bin.requests[requestId]} />)}
					</div>
				)
			)}
		</div>
	);
};

export default Bin;
