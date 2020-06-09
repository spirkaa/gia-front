let configureStore

if (process.env.NODE_ENV === "production") {
  configureStore = require("./configureStore.prod.js").default
} else {
  configureStore = require("./configureStore.dev.js").default
}

export default configureStore
