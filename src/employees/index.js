import Employees from './containers/Employees'
import EmployeeDetail from './containers/EmployeeDetail'

import '../../node_modules/bootswatch/readable/bootstrap.min.css'
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table-all.min.css'
import './components/style.css'

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import data from './reducer'

const rootReducer = combineReducers({
  data,
  routing: routerReducer
})

export { Employees, EmployeeDetail, rootReducer }