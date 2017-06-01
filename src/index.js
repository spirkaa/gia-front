import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

import configureStore from './store'
import Root from './main/containers/Root'
import { tokenCheck } from './auth/actions'

import './assets/css/bootstrap.min.css'
import '../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'
import './assets/css/react-redux-toastr.min.css'
import './assets/css/style.css'

const history = createHistory()
const middleware = routerMiddleware(history)
const store = configureStore(middleware)
const container = document.getElementById('root')

const token = sessionStorage.token || localStorage.token
console.log(token)
if (token && token !== null && token !== 'null') {
  store.dispatch(tokenCheck(token))
}

ReactDOM.render(
  <Root store={store} history={history}/>,
  container
)

if (module.hot) {
  module.hot.accept('./main/containers/Root', () => {
    const NextApp = require('./main/containers/Root').default // eslint-disable-line
    ReactDOM.render(
      <Root store={store} history={history}/>,
      container
    )
  })
}
