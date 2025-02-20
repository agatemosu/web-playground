import { useEffect, useRef, useState } from "preact/hooks";
import { createConsoleProxy } from "./console-proxy";
import type { ConsoleMessage, Log } from "./interfaces/console";
import { ConsoleTab } from "./tabs/console";
import { HtmlTab } from "./tabs/html";
import { OutputTab } from "./tabs/output";

export const App = () => {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [logs, setLogs] = useState<Log[]>([]);
	const [html, setHtml] = useState<string>("");

	useEffect(() => {
		const onMessage = ({ data }: MessageEvent<ConsoleMessage>) => {
			if (data.type !== "console") return;

			const newLog: Log = {
				id: crypto.randomUUID(),
				message: data.args.join(" "),
				prop: data.prop,
			};
			setLogs((prevLogs) => [...prevLogs, newLog]);
		};

		const view = iframeRef.current?.contentDocument?.defaultView;
		if (!view) return;

		view.eval(`(${createConsoleProxy})()`);
		window.addEventListener("message", onMessage);

		return () => window.removeEventListener("message", onMessage);
	}, []);

	useEffect(() => {
		setLogs([]);

		const doc = iframeRef.current?.contentDocument;
		if (!doc) return;

		doc.open();
		doc.write(html);
		doc.close();
	}, [html]);

	return (
		<main className="grid h-dvh grid-cols-2 gap-6 p-6">
			<HtmlTab setHtml={setHtml} />
			<OutputTab iframeRef={iframeRef} />
			<ConsoleTab logs={logs} />
		</main>
	);
};
