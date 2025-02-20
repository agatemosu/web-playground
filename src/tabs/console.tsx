import type { Log } from "../interfaces/console";

interface Props {
	logs: Log[];
}

export const ConsoleTab = ({ logs }: Props) => (
	<div className="h-full w-full overflow-x-auto bg-black">
		{logs.map((log) => (
			<p key={log.id}>{log.message}</p>
		))}
	</div>
);
