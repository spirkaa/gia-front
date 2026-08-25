import { createStore, compose, applyMiddleware } from "redux"
import { thunk } from "redux-thunk"
import { createLogger } from "redux-logger"

import api from "../middleware/api"
import rootReducer from "../reducer"

export default function configureStore() {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk, api, createLogger()),
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
        : (f) => f,
    ),
  )

  if (module.hot) {
    module.hot.accept("../reducer", () => {
      store.replaceReducer(require("../reducer").default) // eslint-disable-line
    })
  }

  return store
}
