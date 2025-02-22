import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	build: { target: "esnext" },
	plugins: [preact(), tailwindcss()],
});
