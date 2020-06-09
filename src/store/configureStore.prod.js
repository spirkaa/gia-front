import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"

import api from "../middleware/api"
import createRootReducer from "../reducer"

export default function configureStore(history, middleware) {
  return createStore(
    createRootReducer(history),
    applyMiddleware(thunk, api, middleware),
  )
}
