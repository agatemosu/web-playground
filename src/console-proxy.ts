import type { ConsoleMessage } from "./interfaces/console";

type LogFn = (...args: unknown[]) => void;

export const createConsoleProxy = (() => {
	const { format } = window.parent.prettyFormat;

	const supportedMethods = ["log", "info", "warn", "error", "debug"];
	const unsupportedMessage: ConsoleMessage = {
		args: ["[Playground] Unsupported console message (see browser console)"],
		prop: "warn",
		type: "console",
	};

	const consoleProxy = new Proxy(console, {
		get: (target, prop: keyof Console) => {
			if (!supportedMethods.includes(prop)) {
				window.parent.postMessage(unsupportedMessage, "*");
				return target[prop];
			}

			return (...args: unknown[]) => {
				const msg: ConsoleMessage = {
					args: args.map((x) => format(x)),
					prop: prop,
					type: "console",
				};
				window.parent.postMessage(msg, "*");

				const originalProp = target[prop] as LogFn;
				return originalProp(...args);
			};
		},
	});

	window.console = consoleProxy;
}).toString();
