import React, { Component } from "react"
import PropTypes from "prop-types"
import { Provider } from "react-redux"
import { Route, Routes } from "react-router-dom"
import { HistoryRouter as Router } from "redux-first-history/rr6"

import { App } from "./App"

export default class Root extends Component {
  render() {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <Router history={history}>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </Router>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}
