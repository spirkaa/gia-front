import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

import { Login } from "./containers"

export const Authenticated = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating)

  if (isAuthenticating || isAuthenticated) {
    return children
  }
  return <Navigate to="/login" replace />
}

export const NotAuthenticated = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect")

  useEffect(() => {
    if (isAuthenticated && !isAuthenticating) {
      navigate(redirect || "/subscriptions", { replace: true })
      toast.success("Добро пожаловать!", { title: "Вход выполнен" })
    }
  }, [isAuthenticated, isAuthenticating, redirect, navigate])

  if (isAuthenticating) {
    return <Login />
  }
  if (isAuthenticated) {
    return null
  }
  return children
}
