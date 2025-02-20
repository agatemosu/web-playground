import type { RefObject } from "preact";

interface Props {
	iframeRef: RefObject<HTMLIFrameElement>;
}

export const OutputTab = ({ iframeRef }: Props) => (
	<iframe
		ref={iframeRef}
		className="h-full w-full bg-white"
		title="Web playground"
	/>
);
