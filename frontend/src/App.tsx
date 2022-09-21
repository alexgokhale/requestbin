import React from "react";
import { Route, Routes } from "react-router-dom";
import { Landing, Error, Bin } from "./pages";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="/:id" element={<Bin />} />
			<Route path="*" element={<Error code={404} />} />
		</Routes>
	);
};

export default App;
