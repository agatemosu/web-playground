import type { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { type ConsoleMessage, createConsoleProxy } from "./console-proxy";

interface Log {
	id: string;
	message: string;
	prop: string;
}

export const App = () => {
	const iframeRef = useRef<HTMLIFrameElement>();
	const [logs, setLogs] = useState<Log[]>([]);

	useEffect(() => {
		const onMessage = ({ data }: MessageEvent<ConsoleMessage>) => {
			if (data.type !== "console") return;

			const newLog: Log = {
				id: crypto.randomUUID(),
				message: data.args.join(" "),
				prop: String(data.prop),
			};
			setLogs((prevLogs) => [...prevLogs, newLog]);
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
	}, []);

	const onBlur: JSX.FocusEventHandler<HTMLTextAreaElement> = (e) => {
		setLogs([]);
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
			<div className="h-full w-full overflow-x-auto bg-black">
				{logs.map((log) => (
					<p key={log.id}>{log.message}</p>
				))}
			</div>
		</main>
	);
};
