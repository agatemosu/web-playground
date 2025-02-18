import { type JSX, createRef } from "preact";
import { useEffect } from "preact/hooks";

interface ConsoleMessage {
	type: string;
}

const consoleProxy = () => {
	console.log("success");
};

export const App = () => {
	const iframeRef = createRef<HTMLIFrameElement>();

	useEffect(() => {
		const onMessage = ({ data }: MessageEvent<ConsoleMessage>) => {
			if (data.type === "console") {
				console.log(data);
			}
		};

		window.addEventListener("message", onMessage);

		return () => {
			window.removeEventListener("message", onMessage);
		};
	}, []);

	const onBlur: JSX.FocusEventHandler<HTMLTextAreaElement> = (e) => {
		const doc = iframeRef.current.contentDocument;

		const consoleProxyScript = document.createElement("script");
		consoleProxyScript.innerHTML = `(${consoleProxy.toString()})()`;

		doc.open();
		doc.write(e.currentTarget.value || "<html></html>");
		doc.head.appendChild(consoleProxyScript);
		doc.close();
	};

	return (
		<main className="grid grid-cols-2 h-dvh p-6 gap-6">
			<div>
				<textarea
					className="h-full w-full bg-white text-black resize-none"
					onBlur={onBlur}
				/>
			</div>
			<div>
				<iframe
					ref={iframeRef}
					title="Web playground"
					className="h-full w-full bg-white resize-none"
				/>
			</div>
		</main>
	);
};
