export interface Log {
	id: string;
	message: string;
	prop: string;
}

export interface ConsoleMessage {
	args: string[];
	prop: string;
	type: "console";
}
