import type { Dispatch, StateUpdater } from "preact/hooks";

interface Props {
	html: string;
	setHtml: Dispatch<StateUpdater<string>>;
}

export const HtmlTab = ({ html, setHtml }: Props) => (
	<textarea
		className="w-full resize-none border-2 border-transparent bg-blue-800 p-2 font-mono outline-none selection:bg-red-800 focus:border-white"
		onBlur={(e) => setHtml(e.currentTarget.value)}
		value={html}
	/>
);
