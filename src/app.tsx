import { type JSX, createRef } from "preact";
import { useEffect } from "preact/hooks";
import { type ConsoleMessage, createConsoleProxy } from "./console-proxy";

export const App = () => {
	const iframeRef = createRef<HTMLIFrameElement>();
	const logRef = createRef<HTMLDivElement>();

	useEffect(() => {
		const onMessage = ({ data }: MessageEvent<ConsoleMessage>) => {
			if (data.type !== "console") return;

			const p = document.createElement("p");
			p.textContent = data.args.join(" ");
			logRef.current.appendChild(p);
		};

		const doc = iframeRef.current.contentDocument;

		doc.open();
		doc.write("<html></html>");
		doc.close();

		const consoleProxyScript = document.createElement("script");
		consoleProxyScript.innerHTML = `(${createConsoleProxy})()`;
		doc.head.appendChild(consoleProxyScript);

		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, [iframeRef, logRef]);

	const onBlur: JSX.FocusEventHandler<HTMLTextAreaElement> = (e) => {
		logRef.current.innerHTML = "";
		const doc = iframeRef.current.contentDocument;

		doc.open();
		doc.write(e.currentTarget.value);
		doc.close();
	};

	return (
		<main className="grid h-dvh grid-cols-2 gap-6 p-6">
			<textarea
				className="row-span-2 resize-none bg-blue-800 font-mono selection:bg-red-800"
				onBlur={onBlur}
			/>
			<iframe
				ref={iframeRef}
				className="h-full w-full bg-white"
				title="Web playground"
			/>
			<div ref={logRef} className="h-full w-full overflow-x-auto bg-black" />
		</main>
	);
};
