import { combineReducers } from "redux"
import { connectRouter } from "connected-react-router"
import { reducer as toastr } from "react-redux-toastr"

import { auth } from "./auth/reducer"
import { entities } from "./main/reducer"
import { subs } from "./subscriptions/reducer"
import { subsActivePage } from "./subscriptions/reducer"
import { empActivePage, empFilter } from "./employees/reducer"
import { examActivePage, examFilter } from "./exams/reducer"
import { orgActivePage, orgFilter } from "./organisations/reducer"
import { placesActivePage, placesFilter } from "./places/reducer"

const filters = combineReducers({
  empFilter,
  examFilter,
  orgFilter,
  placesFilter,
})

const pagination = combineReducers({
  empActivePage,
  examActivePage,
  orgActivePage,
  placesActivePage,
  subsActivePage,
})

const createRootReducer = (history) =>
  combineReducers({
    auth,
    entities,
    filters,
    pagination,
    router: connectRouter(history),
    subs,
    toastr,
  })

export default createRootReducer
