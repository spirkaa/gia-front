import { createStore, applyMiddleware } from "redux"
import { thunk } from "redux-thunk"

import api from "../middleware/api"
import rootReducer from "../reducer"

if (import.meta.hot) {
  import.meta.hot.accept("../reducer")
}

export default function configureStore() {
  return createStore(rootReducer, applyMiddleware(thunk, api))
}
