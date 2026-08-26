import { createRoot } from "react-dom/client"

import configureStore from "./store"
import Root from "./main/containers/Root"
import { tokenCheck } from "./auth/actions"

import "react-bootstrap-table-ng/dist/react-bootstrap-table-ng.min.css"
import "./assets/css/bootstrap.min.css"
import "./assets/css/style.css"

const store = configureStore()
const container = document.getElementById("root")

const token = sessionStorage.token || localStorage.token
if (token && token !== null && token !== "null") {
  store.dispatch(tokenCheck(token))
}

createRoot(container).render(<Root store={store} />)
