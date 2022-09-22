import React, { useState } from "react";
import { Header, Button } from "../components";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { RequestBinResponse, ErrorResponse } from "../types";

const Landing = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleCreateBin = async () => {
		setError(null);
		setLoading(true);

		try {
			const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/create`, {
				method: "POST"
			});

			if (response.ok) {
				const body = await response.json() as RequestBinResponse;
				navigate(`/${body.bin.id}`);

				return;
			}

			const body = await response.json() as ErrorResponse;

			setError(body.message);
		} catch (_) {
			setError("An unknown error occurred");
		}

		setLoading(false);
	};

	return (
		<div className="m-8 select-none">
			<Header row={<>
				<Button
					loading={loading}
					className={
						"flex items-center justify-center disabled:cursor-not-allowed shadow-lg tracking-tight " +
						"rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg px-4 py-1"}
					onClick={handleCreateBin}
					text="Create a Bin"
					textClassName="font-mono"
				/>

				{error && (
					<p className="mt-3 font-bold font-mono text-red-600 text-sm flex gap-2 items-center">
						<ExclamationCircleIcon className="w-5 h-5 inline-block" />
						{error}
					</p>
				)}
			</>} />

			<div className="mt-16">
				<h5 className="font-mono font-bold text-pink-600 mb-1">
					# What can I do with this?
				</h5>
				<p className="ml-2 font-mono text-neutral-400 font-bold text-sm">
					Anything you want really. Each request you make to the endpoint provided can be inspected, including:
				</p>
				<p className="ml-4 font-mono text-neutral-400 font-bold text-sm">- Request Method</p>
				<p className="ml-4 font-mono text-neutral-400 font-bold text-sm">- Timestamp</p>
				<p className="ml-4 font-mono text-neutral-400 font-bold text-sm">- Headers</p>
				<p className="ml-4 font-mono text-neutral-400 font-bold text-sm">- Body (including formatting for common types)</p>
			</div>

			<div className="mt-8">
				<h5 className="font-mono font-bold text-pink-600 mb-1">
					# Is it open-source?
				</h5>
				<p className="ml-2 font-mono text-neutral-400 font-bold text-sm">
					Yes.{" "}
					<a
						className="font-mono text-cyan-600 underline cursor-pointer"
						target="_blank" rel="noreferrer noopener"
						href="https://gitlab.com/honour/requestbin"
					>
						https://gitlab.com/honour/requestbin
					</a>
				</p>
			</div>

			<div className="mt-8">
				<h5 className="font-mono font-bold text-pink-600 mb-1">
					# Who made this <span className="font-mono font-extrabold">*amazing*</span> tool?
				</h5>
				<p className="ml-2 font-mono text-neutral-400 font-bold text-sm">
					Me.{" "}
					<a
						className="font-mono text-cyan-600 underline cursor-pointer"
						target="_blank" rel="noreferrer noopener"
						href="https://alexgokhale.com"
					>
						https://alexgokhale.com
					</a>
				</p>
			</div>
		</div>
	);
};

export default Landing;
