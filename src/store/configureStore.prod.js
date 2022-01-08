import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"

import api from "../middleware/api"
import createRootReducer from "../reducer"

export default function configureStore(router, middleware) {
  return createStore(
    createRootReducer(router),
    applyMiddleware(thunk, api, middleware),
  )
}
