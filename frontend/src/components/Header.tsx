import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
	row?: JSX.Element
}

const Header = (props: HeaderProps) => {
	const { row } = props;

	return (
		<>
			<Link to="/">
				<h1 className="text-4xl font-mono text-white font-bold transition duration-500 hover:text-pink-500">
					RequestBin
				</h1>
			</Link>
			<h5 className="font-mono italic text-neutral-400 font-bold">
				A platform to inspect HTTP requests quickly and easily.
			</h5>

			{row ? <div className="mt-4">{row}</div> : null}
		</>
	);
};

export default Header;
