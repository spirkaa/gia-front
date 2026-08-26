import { Route, Routes as RouterRoutes } from "react-router-dom"

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

export const Routes = () => (
  <RouterRoutes>
    <Route path="/exams" element={<Exams />} />
    <Route path="/employees" element={<Employees />} />
    <Route path="/employees/detail/:employeeId" element={<EmployeeDetail />} />
    <Route path="/organisations" element={<Organisations />} />
    <Route path="/organisations/detail/:orgId" element={<OrganisationDetail />} />
    <Route path="/places" element={<Places />} />
    <Route path="/about" element={<About />} />

    <Route
      path="/password-reset"
      element={
        <NotAuthenticated>
          <PasswordReset />
        </NotAuthenticated>
      }
    />
    <Route
      path="/password-reset/email-sent"
      element={
        <NotAuthenticated>
          <PasswordEmailSent />
        </NotAuthenticated>
      }
    />
    <Route
      path="/password-reset/confirm/:uid/:token"
      element={
        <NotAuthenticated>
          <PasswordResetConfirm />
        </NotAuthenticated>
      }
    />
    <Route
      path="/registration"
      element={
        <NotAuthenticated>
          <Registration />
        </NotAuthenticated>
      }
    />
    <Route
      path="/registration/confirm-email/:key"
      element={<RegistrationEmailConfirm />}
    />
    <Route
      path="/settings"
      element={
        <Authenticated>
          <Settings />
        </Authenticated>
      }
    />
    <Route path="/logout" element={<Logout />} />
    <Route
      path="/login"
      element={
        <NotAuthenticated>
          <Login />
        </NotAuthenticated>
      }
    />

    <Route
      path="/subscriptions"
      element={
        <Authenticated>
          <Subscriptions />
        </Authenticated>
      }
    />

    <Route path="/" element={<Home />} />
    <Route path="*" element={<NotFound />} />
  </RouterRoutes>
)

export default Routes
