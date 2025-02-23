import type { Log } from "../console/types";

interface Props {
	logs: Log[];
}

export const ConsoleTab = ({ logs }: Props) => (
	<div className="w-full overflow-auto bg-black font-mono">
		{logs.map((log) => (
			<p key={log.id} className="border-neutral-800 border-b-1 p-1">
				{log.message}
			</p>
		))}
	</div>
);
