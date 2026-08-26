import path from "node:path"
import zlib from "node:zlib"
import { createRequire } from "node:module"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { compression, defineAlgorithm } from "vite-plugin-compression2"

const require = createRequire(import.meta.url)
const eventsPkg = require.resolve("events/package.json")

// redux-logger has no "sideEffects": false flag, so the bundler keeps its
// (unused in prod) module in the bundle. Stub it out in the prod build;
// the dev server keeps the real one for console logging.
const dropReduxLogger = {
  name: "drop-redux-logger",
  apply: "build",
  load(id) {
    if (id.includes("node_modules/redux-logger/") && id.endsWith(".js")) {
      return "export const createLogger = () => (next) => (action) => next(action)"
    }
  },
}

export default defineConfig({
  plugins: [
    react(),
    dropReduxLogger,
    compression({
      algorithms: [
        defineAlgorithm("gzip", { level: 9 }),
        defineAlgorithm("brotliCompress", {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
            [zlib.constants.BROTLI_PARAM_LGWIN]: 22,
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          },
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      events: path.join(path.dirname(eventsPkg), "events.js"),
    },
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 700,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    reporters: ["default", ["junit", { outputFile: "./reports/junit.xml" }]],
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: ["src/test/**", "src/**/*.test.jsx", "src/**/*.css"],
      reporter: ["cobertura", "text-summary", "html"],
      reportsDirectory: "./reports",
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
