import { useEffect, useRef, useState } from "preact/hooks";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { consoleInitScript } from "./console/proxy";
import type { ConsoleMessage, Log } from "./console/types";
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

		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, []);

	useEffect(() => {
		setLogs([]);

		const iframe = iframeRef.current;
		if (!iframe) return;

		iframe.srcdoc = consoleInitScript() + html;
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
