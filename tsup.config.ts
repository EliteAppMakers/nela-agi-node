import { defineConfig } from "tsup";

export default defineConfig({
  name: "nela-agi",
  entry: ["./src/index.ts"],
  target: "es2016",
  minify: true,
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  // sourcemap: true,
  splitting: false,
  clean: true,
  skipNodeModulesBundle: true,
  // bundle: false,
  platform: "node",
  shims: true,
  treeshake: true,
});
