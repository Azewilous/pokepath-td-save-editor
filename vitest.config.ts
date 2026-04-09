import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [solid({ hot: false })],
  resolve: {
    alias: { "~": resolve(__dirname, "src") },
    conditions: ["development", "browser"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    reporters: process.env.CI ? ["verbose"] : ["verbose", "html"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/entry-client.tsx"],
    },
  },
});
