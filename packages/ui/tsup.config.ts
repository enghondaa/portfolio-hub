import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  // NOTE: several components (Button, Input, Select, Modal, Tabs, Navbar,
  // ThemeToggle) start with "use client" for Next.js App Router. This single
  // bundled entry may or may not preserve that directive in the emitted
  // dist/index.{js,mjs} — verify when Phase 2 actually imports @portfolio/ui
  // into a Next.js app; if the directive is lost, switch to bundle: false
  // with per-file entries so each component keeps its own directive.
});
