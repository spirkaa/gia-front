import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import api from '../middleware/api'
import rootReducer from '../reducer'

export default function configureStore (middleware) {
  return createStore(
    rootReducer,
    applyMiddleware(thunk, api, middleware)
  )
}
