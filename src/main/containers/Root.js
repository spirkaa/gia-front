import React from "react"
import PropTypes from "prop-types"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"

import { App } from "./App"

export default function Root({ store }) {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
}
