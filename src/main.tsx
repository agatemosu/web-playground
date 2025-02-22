import { render } from "preact";
import * as prettyFormat from "pretty-format";
import { App } from "./app";
import "./styles.css";

window.prettyFormat = prettyFormat;
render(<App />, document.querySelector("#app")!);
