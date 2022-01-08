import { createStore, compose, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { createLogger } from "redux-logger"

import api from "../middleware/api"
import createRootReducer from "../reducer"

export default function configureStore(router, middleware) {

  const store = createStore(
    createRootReducer(router),
    compose(
      applyMiddleware(thunk, api, middleware, createLogger()),
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
        : (f) => f,
    ),
  )

  if (module.hot) {
    module.hot.accept("../reducer", () => {
      store.replaceReducer(createRootReducer(router))
    })
  }

  return store
}
