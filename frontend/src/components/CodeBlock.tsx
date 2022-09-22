import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";

interface CodeBlockProps {
	code: string,
	lang?: string
}

const CodeBlock = ({ code, lang }: CodeBlockProps) => {
	const classes = "bg-black/10 rounded-lg p-2 mt-3 text-sm text-white";
	const highlightRef = useRef<HTMLPreElement>(null);

	useEffect(() => {
		if (highlightRef.current) {
			const nodes = highlightRef.current.querySelectorAll("pre code");

			for (let i = 0; i < nodes.length; i++)
				hljs.highlightBlock(nodes[i] as HTMLElement);
		}
	}, [code, lang]);

	return (
		<pre ref={highlightRef} className={classes}>
			<code className={`${lang ? `language-${lang}` : ""} !bg-transparent`}>{code}</code>
		</pre>
	);
};

export default CodeBlock;
