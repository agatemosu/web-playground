import type { Log } from "../interfaces/console";

interface Props {
	logs: Log[];
}

export const ConsoleTab = ({ logs }: Props) => (
	<div className="w-full overflow-auto bg-neutral-700 font-mono">
		{logs.map((log) => (
			<p key={log.id}>{log.message}</p>
		))}
	</div>
);
