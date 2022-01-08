import React from "react"
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom"

import { EmployeeDetail, Employees } from "./employees/containers"
import { OrganisationDetail, Organisations } from "./organisations/containers"
import { Exams } from "./exams/containers"
import { Places } from "./places/containers"
import {
  Login,
  Logout,
  PasswordEmailSent,
  PasswordReset,
  PasswordResetConfirm,
  Registration,
  RegistrationEmailConfirm,
  Settings,
} from "./auth/containers"
import { Subscriptions } from "./subscriptions/containers"
import { About, Home, NotFound } from "./main/components"
import { Authenticated, NotAuthenticated } from "./auth"

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/exams" element={<Exams />} />
    <Route path="/employees" element={<Employees />} />
    <Route path="/employees/detail/:employeeId" element={<EmployeeDetailHook />} />
    <Route path="/organisations" element={<Organisations />} />
    <Route path="/organisations/detail/:orgId" element={<OrganisationDetailHook />} />
    <Route path="/places" element={<Places />} />
    <Route path="/about" element={<About />} />

    {/* <Route exact path="/password-reset" element={<NotAuthenticated(PasswordReset) />} />
    <Route
      exact
      path="/password-reset/email-sent"
      element={<NotAuthenticated(PasswordEmailSent)}
    />
    <Route
      exact
      path="/password-reset/confirm/:uid/:token"
      element={<NotAuthenticated(PasswordResetConfirm)}
    /> */}
    {/* <Route exact path="/registration" element={<NotAuthenticated(Registration)} /> */}
    <Route
      path="/registration/confirm-email/:key"
      element={<RegistrationEmailConfirm />}
    />
    {/* <Route exact path="/settings" element={<Authenticated(Settings)} /> */}
    <Route path="/logout" element={<Logout />} />
    {/* <Route exact path="/login" element={<NotAuthenticated(Login)} /> */}

    {/* <Route exact path="/subscriptions" element={<Authenticated(Subscriptions)} /> */}

    <Route path="*" element={<NotFound />} />
  </Routes>
)

function EmployeeDetailHook() {
  let location = useLocation()
  let navigate = useNavigate()
  let params = useParams()
  return <EmployeeDetail location={location} navigate={navigate} params={params} />
}

function OrganisationDetailHook() {
  let location = useLocation()
  let navigate = useNavigate()
  let params = useParams()
  return <OrganisationDetail location={location} navigate={navigate} params={params} />
}

export default AppRoutes
