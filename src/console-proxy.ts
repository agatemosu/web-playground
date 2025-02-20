import type { ConsoleMessage } from "./interfaces/console";

type LogFn = (...args: unknown[]) => void;

export const createConsoleProxy = (() => {
	const cvString = (x: unknown) => {
		return typeof x === "object" || typeof x === "string"
			? JSON.stringify(x)
			: String(x);
	};

	const supportedMethods = ["log", "info", "warn", "error"];
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
					args: args.map(cvString),
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
