import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header, Spinner, Request, Button } from "../components";
import { Error } from "../pages";
import { RequestBin, RequestBinResponse, ErrorResponse } from "../types";
import { QuestionMarkCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";

const Bin = () => {
	const { id } = useParams();

	const [loading, setLoading] = useState(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [refresh, setRefresh] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [binNotFound, setBinNotFound] = useState(false);
	const [bin, setBin] = useState<RequestBin | null>(null);

	useEffect(() => {
		const interval = setInterval(() => {
			setRefresh(Math.random());
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);

				const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/${id}`);

				if (response.ok) {
					const body = await response.json() as RequestBinResponse;
					setBin(body.bin);
					setIsInitialLoad(false);
					setError(null);
					setBinNotFound(false);
				} else if (response.status === 404) {
					setBinNotFound(true);
					setError("Request bin not found");
				} else {
					const errorBody = await response.json() as ErrorResponse;
					setError(errorBody.message || "An unknown error occurred");
				}
			} catch (err) {
				setError("An unknown error occurred");
			} finally {
				setLoading(false);
			}
		})();
	}, [id, refresh]);

	if (binNotFound && !bin) {
		return (
			<Error code={404} message="A request bin could not be found with the ID provided"/>
		);
	}

	if (isInitialLoad && loading) {
		return (
			<div className="m-8">
				<Header row={<Spinner />} />
			</div>
		);
	}

	return (
		<div className="m-8">
			<Header row={(
				<div className="flex items-center justify-between">
					<p className="font-mono text-pink-500 font-bold select-none">
						Your RequestBin endpoint:{" "}
						<span className="font-mono select-all rounded-lg p-1 px-2 bg-black/25 text-neutral-300">
							{process.env.REACT_APP_BASE_API_URL}/-/{id}
						</span>
					</p>
					<div className="flex items-center gap-2">
						<svg
							className={`animate-spin h-5 w-5 text-white transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0"}`}
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
							<path
								className="opacity-75" fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<Button
							className={
								"flex items-center justify-center disabled:cursor-not-allowed shadow-lg tracking-tight " +
								"rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg px-4 py-1"}
							text="Refresh"
							textClassName="font-mono"
							onClick={() => setRefresh(Math.random())}
						/>
					</div>
				</div>
			)} />

			{error && !binNotFound && (
				<div className="mt-4 bg-red-900/50 border border-red-500 rounded-lg p-2 flex items-center gap-3">
					<ExclamationCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
					<p className="font-mono text-red-200 text-sm">{error}</p>
				</div>
			)}

			{bin && (
				Object.keys(bin.requests).length === 0 ? (
					<div className="flex mt-4 gap-2">
						<QuestionMarkCircleIcon className="h-6 w-6 text-white" />
						<p className="font-bold text-white">No Requests Found</p>
					</div>
				) : (
					<div className="flex gap-4 mt-4 flex-col">
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
