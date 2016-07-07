import { createStore, compose, applyMiddleware } from 'redux'
import api from './middleware/api'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducer'

export default function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, api, createLogger()),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}
