import { render } from "preact";
import * as prettyFormat from "pretty-format";
import { App } from "./app";

window.prettyFormat = prettyFormat;
render(<App />, document.querySelector("#app")!);
