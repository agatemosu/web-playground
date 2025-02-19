export interface ConsoleMessage {
	args: string[];
	prop: string | symbol;
	type: "console";
}

export const createConsoleProxy = (() => {
	const cvString = (x: unknown) => {
		return typeof x === "object" || typeof x === "string"
			? JSON.stringify(x)
			: String(x);
	};

	const consoleProxy = new Proxy(console, {
		get: (target, prop) => {
			const originalProp = target[prop];
			if (typeof originalProp !== "function") return originalProp;

			return (...args: unknown[]) => {
				const msg: ConsoleMessage = {
					args: args.map(cvString),
					prop: prop,
					type: "console",
				};

				window.parent.postMessage(msg, "*");
				originalProp(...args);
			};
		},
	});

	window.console = consoleProxy;
}).toString();
