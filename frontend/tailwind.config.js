// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			colors: {
				ocean: "#012525"
			},
			fontFamily: {
				mono: ["'Jetbrains Mono'", ...defaultTheme.fontFamily.mono]
			}
		}
	},
	plugins: []
};
