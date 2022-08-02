import React from "react";
import { Header } from "../components";

const Landing = () => {
	return (
		<div className="m-8 select-none">
			<Header row={<>
				<button className="shadow-lg tracking-tight font-mono rounded-md bg-cyan-600 text-white font-semibold text-lg px-4 py-1">
					Create a Bin
				</button>
			</>} />

			<div className="mt-16">
				<h5 className="font-mono text-red-500 mb-1">
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
				<h5 className="font-mono text-red-500 mb-1">
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
				<h5 className="font-mono text-red-500 mb-1">
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
