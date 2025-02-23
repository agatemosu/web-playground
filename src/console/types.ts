export interface Log {
	id: string;
	message: string;
	prop: Method;
}

export interface ConsoleMessage {
	args: string[];
	prop: Method;
	type: "console";
}

export type Method = "log" | "info" | "warn" | "error" | "debug";
