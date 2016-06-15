import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { Employees, EmployeeDetail } from './employees'
import NotFound from './main/components/NotFound'
import Home from './main/components/Home'
import App from './main/containers/App'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home}/>
    <Route path='employees' component={Employees}/>
    <Route path='employees/:employee_id' component={EmployeeDetail}/>
    <Route path='*' component={NotFound}/>
  </Route>
)
