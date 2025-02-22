import { render } from "preact";
import { App } from "./app";
import "./styles.css";

window.prettyFormat = await import("pretty-format");
render(<App />, document.querySelector("#app")!);
