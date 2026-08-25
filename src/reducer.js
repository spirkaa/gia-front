import { combineReducers } from "redux"

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

const rootReducer = combineReducers({
  auth,
  entities,
  filters,
  pagination,
  subs,
})

export default rootReducer
