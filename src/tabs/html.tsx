import type { Dispatch, StateUpdater } from "preact/hooks";

interface Props {
	html: string;
	setHtml: Dispatch<StateUpdater<string>>;
}

export const HtmlTab = ({ html, setHtml }: Props) => (
	<textarea
		className="w-full resize-none bg-neutral-700 p-2 font-mono selection:bg-red-800"
		onBlur={(e) => setHtml(e.currentTarget.value)}
		value={html}
	/>
);
