import { useEffect, useRef, useState } from "preact/hooks";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
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
		<Tabs>
			<TabList>
				<Tab>HTML</Tab>
				<Tab>Output</Tab>
				<Tab>Console</Tab>
			</TabList>
			<TabPanel>
				<HtmlTab html={html} setHtml={setHtml} />
			</TabPanel>
			<TabPanel forceRender={true}>
				<OutputTab iframeRef={iframeRef} />
			</TabPanel>
			<TabPanel>
				<ConsoleTab logs={logs} />
			</TabPanel>
		</Tabs>
	);
};
