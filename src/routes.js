import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { EmployeeDetail, Employees } from './employees/containers'
import { OrganisationDetail, Organisations } from './organisations/containers'
import { Exams } from './exams/containers'
import { Places } from './places/containers'
import {
  Login,
  Logout,
  PasswordEmailSent,
  PasswordReset,
  PasswordResetConfirm,
  Registration,
  RegistrationEmailConfirm,
  Settings,
} from './auth/containers'
import { Subscriptions } from './subscriptions/containers'
import { About, Home, NotFound } from './main/components'
import { Authenticated, NotAuthenticated } from './auth'

export const Routes = () => (
  <Switch>
    <Route exact path='/exams' component={Exams}/>
    <Route exact path='/employees' component={Employees}/>
    <Route exact path='/employees/detail/:employeeId' component={EmployeeDetail}/>
    <Route exact path='/organisations' component={Organisations}/>
    <Route exact path='/organisations/detail/:orgId' component={OrganisationDetail}/>
    <Route exact path='/places' component={Places}/>
    <Route exact path='/about' component={About}/>

    <Route exact path='/password-reset' component={NotAuthenticated(PasswordReset)}/>
    <Route exact path='/password-reset/email-sent' component={NotAuthenticated(PasswordEmailSent)}/>
    <Route exact path='/password-reset/confirm/:uid/:token' component={NotAuthenticated(PasswordResetConfirm)}/>
    <Route exact path='/registration' component={NotAuthenticated(Registration)}/>
    <Route exact path='/registration/confirm-email/:key' component={RegistrationEmailConfirm}/>
    <Route exact path='/settings' component={Authenticated(Settings)}/>
    <Route exact path='/logout' component={Logout}/>
    <Route exact path='/login' component={NotAuthenticated(Login)}/>

    <Route exact path='/subscriptions' component={Authenticated(Subscriptions)}/>

    <Route exact path='/' component={Home}/>
    <Route component={NotFound}/>
  </Switch>
)

export default Routes