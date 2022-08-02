import React from "react";
import { Route, Routes } from "react-router-dom";
import { Landing, Error } from "./pages";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="*" element={<Error code={404} />} />
		</Routes>
	);
};

export default App;
