import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  base: "/pokepath-td-save-editor/",
  plugins: [solid()],
  resolve: {
    alias: { "~": "/src" },
  },
});
