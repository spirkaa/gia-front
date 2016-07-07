import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { entities, errorMessage } from './main/reducer'
import { empActivePage, empFilter } from './employees/reducer'
import { examActivePage, examFilter } from './exams/reducer'
import { orgActivePage, orgFilter } from './organisations/reducer'
import { placesActivePage, placesFilter } from './places/reducer'

const filters = combineReducers({
  empFilter,
  examFilter,
  orgFilter,
  placesFilter
})

const pagination = combineReducers({
  empActivePage,
  examActivePage,
  orgActivePage,
  placesActivePage
})

export default combineReducers({
  errorMessage,
  entities,
  filters,
  pagination,
  routing
})