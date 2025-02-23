import type { ConsoleMessage, Method } from "./types";

type LogHandler = (...args: unknown[]) => void;

const consoleInit = (() => {
	const { format } = window.parent.prettyFormat;

	const methods: Method[] = ["log", "info", "warn", "error", "debug"];
	const unsupported: ConsoleMessage = {
		args: ["[Playground] Unsupported console message (see browser console)"],
		prop: "warn",
		type: "console",
	};

	const consoleProxy = new Proxy(console, {
		get: (target, prop: Method) => {
			if (!methods.includes(prop)) {
				window.parent.postMessage(unsupported, "*");
				return target[prop];
			}

			return (...args: unknown[]) => {
				const message: ConsoleMessage = {
					args: args.map((x) => format(x)),
					prop: prop,
					type: "console",
				};
				window.parent.postMessage(message, "*");

				const originalMethod = target[prop] as LogHandler;
				return originalMethod(...args);
			};
		},
	});

	window.console = consoleProxy;
	window.addEventListener("error", (e) => console.error(e.error));

	document.currentScript?.remove();
}).toString();

export const consoleInitScript = () => {
	const script = document.createElement("script");
	script.textContent = `(${consoleInit})();`;
	return script.outerHTML;
};
