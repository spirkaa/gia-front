import { createStore, compose, applyMiddleware } from "redux"
import { thunk } from "redux-thunk"
import { createLogger } from "redux-logger"

import api from "../middleware/api"
import rootReducer from "../reducer"

export default function configureStore() {
  const middlewares = [thunk, api]
  if (import.meta.env.MODE !== "test") {
    middlewares.push(createLogger())
  }
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(...middlewares),
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
        : (f) => f,
    ),
  )

  if (import.meta.hot) {
    import.meta.hot.accept("../reducer", (reducer) => {
      if (reducer && reducer.default) {
        store.replaceReducer(reducer.default)
      }
    })
  }

  return store
}
