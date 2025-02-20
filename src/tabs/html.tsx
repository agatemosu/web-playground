import type { Dispatch, StateUpdater } from "preact/hooks";

interface Props {
	setHtml: Dispatch<StateUpdater<string>>;
}

export const HtmlTab = ({ setHtml }: Props) => (
	<textarea
		className="row-span-2 h-full w-full resize-none bg-blue-800 p-2 font-mono selection:bg-red-800 focus:outline-2 focus:outline-white"
		onBlur={(e) => setHtml(e.currentTarget.value)}
	/>
);
