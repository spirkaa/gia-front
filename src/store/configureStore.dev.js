import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import api from '../middleware/api'
import rootReducer from '../reducer'

export default function configureStore (middleware) {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk, api, middleware, createLogger()),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (module.hot) {
    module.hot.accept('../reducer', () => {
      const nextRootReducer = require('../reducer').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
