import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  // @vercel/postgres is only reached through a dynamic import in the Postgres
  // adapter, so it must stay external — bundling it would pull a database
  // driver into every consumer, including the client-side storefront.
  external: ["@vercel/postgres"],
});
