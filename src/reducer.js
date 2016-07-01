import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { entities, errorMessage } from './main/reducer'
import { activePage, filter } from './employees/reducer'

export default combineReducers({
  activePage,
  errorMessage,
  entities,
  filter,
  routing
})