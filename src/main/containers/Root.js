import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import App from '../../main/containers/App'

export default class Root extends Component {
  render () {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path='/' component={App}/>
        </ConnectedRouter>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}
