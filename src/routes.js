import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { Employees, EmployeeDetail } from './employees/containers'
import { Organisations, OrganisationDetail } from './organisations/containers'
import { Exams } from './exams/containers'
import { Places } from './places/containers'
import { About, Home, NotFound } from './main/components'
import App from './main/containers/App'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home}/>
    <Route path='exams' component={Exams}/>
    <Route path='employees' component={Employees}/>
    <Route path='employees/detail/:employeeId' component={EmployeeDetail}/>
    <Route path='organisations' component={Organisations}/>
    <Route path='organisations/detail/:orgId' component={OrganisationDetail}/>
    <Route path='places' component={Places}/>
    <Route path='about' component={About}/>
    <Route path='*' component={NotFound}/>
  </Route>
)
