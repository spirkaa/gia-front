import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import Root from './main/containers/Root'
import configureStore from './store'

import './assets/css/bootstrap.min.css'
import '../node_modules/react-bootstrap-table/css/react-bootstrap-table-all.min.css'
import './assets/css/style.css'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)
const container = document.getElementById('root')

render(
  <AppContainer>
    <Root store={store} history={history}/>
  </AppContainer>,
  container
)

if (module.hot) {
  module.hot.accept('./main/containers/Root', () => {
    const NextApp = require('./main/containers/Root').default
    render(
      <AppContainer>
        <Root store={store} history={history}/>
      </AppContainer>,
      container
    )
  })
}
