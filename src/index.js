import React from "react"
import ReactDOM from "react-dom"
import { createBrowserHistory } from "history"
import { routerMiddleware } from "connected-react-router"

import configureStore from "./store"
import Root from "./main/containers/Root"
import { tokenCheck } from "./auth/actions"

import "../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import "../node_modules/react-redux-toastr/lib/css/react-redux-toastr.min.css"
import "./assets/css/bootstrap.min.css"
import "./assets/css/style.css"

const history = createBrowserHistory()
const middleware = routerMiddleware(history)
const store = configureStore(history, middleware)
const container = document.getElementById("root")

const token = sessionStorage.token || localStorage.token
if (token && token !== null && token !== "null") {
  store.dispatch(tokenCheck(token))
}

ReactDOM.render(<Root store={store} history={history} />, container)

if (module.hot) {
  module.hot.accept("./main/containers/Root", () => {
    const NextApp = require("./main/containers/Root").default // eslint-disable-line
    ReactDOM.render(<Root store={store} history={history} />, container)
  })
}
