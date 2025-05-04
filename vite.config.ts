import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "node:path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './shared'),
      '@': path.resolve(__dirname, './app')
    }
  }
});
