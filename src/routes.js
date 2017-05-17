import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Employees, EmployeeDetail } from './employees/containers'
import { Organisations, OrganisationDetail } from './organisations/containers'
import { Exams } from './exams/containers'
import { Places } from './places/containers'
import { About, Home, NotFound } from './main/components'


export const Routes = () => (
  <Switch>
    <Route exact path='/exams' component={Exams}/>
    <Route exact path='/employees' component={Employees}/>
    <Route exact path='/employees/detail/:employeeId' component={EmployeeDetail}/>
    <Route exact path='/organisations' component={Organisations}/>
    <Route exact path='/organisations/detail/:orgId' component={OrganisationDetail}/>
    <Route exact path='/places' component={Places}/>
    <Route exact path='/about' component={About}/>
    <Route exact path='/' component={Home}/>
    <Route path='*' component={NotFound}/>
  </Switch>
)

export default Routes