import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './main/containers/Root'
import configureStore from './store'

import '../node_modules/bootswatch/yeti/bootstrap.min.css'
import '../node_modules/react-bootstrap-table/css/react-bootstrap-table-all.min.css'
import './main/components/style.css'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

render(
  <Root store={store} history={history}/>,
  document.getElementById('root')
)