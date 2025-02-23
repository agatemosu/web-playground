import { clsx } from "clsx";
import type { LucideIcon } from "lucide-preact";
import { AlertTriangle, Bug, Info, Pencil, XCircle } from "lucide-preact";
import { h } from "preact";
import type { Log, Method } from "../console/types";

const Icon = ({ name }: { name: Method }) => {
	const icons: Record<Method, LucideIcon> = {
		log: Pencil,
		info: Info,
		warn: AlertTriangle,
		error: XCircle,
		debug: Bug,
	};

	return h(icons[name], { size: 16, style: { flexShrink: 0 } });
};

interface Props {
	logs: Log[];
}

export const ConsoleTab = ({ logs }: Props) => (
	<div className="w-full overflow-auto bg-black font-mono">
		{logs.map((log) => (
			<div
				key={log.id}
				className={clsx(
					"flex items-center gap-2 border-neutral-800 border-b p-1 pl-2",
					{
						"text-green-400": log.prop === "log",
						"text-blue-400": log.prop === "info",
						"text-yellow-400": log.prop === "warn",
						"text-red-400": log.prop === "error",
						"text-gray-400": log.prop === "debug",
					},
				)}
			>
				<Icon name={log.prop} />
				<p className="break-all">{log.message}</p>
			</div>
		))}
	</div>
);
