import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { entities, errorMessage } from './main/reducer'
import { empActivePage, empFilter } from './employees/reducer'
import { examActivePage, examFilter } from './exams/reducer'
import { orgActivePage, orgFilter } from './organisations/reducer'

const filters = combineReducers({
  empFilter,
  examFilter,
  orgFilter
})

const pagination = combineReducers({
  empActivePage,
  examActivePage,
  orgActivePage
})

export default combineReducers({
  errorMessage,
  entities,
  filters,
  pagination,
  routing
})