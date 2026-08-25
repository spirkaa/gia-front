import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import { authLogout } from "../actions"

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const didRun = useRef(false)
  useEffect(() => {
    if (didRun.current) {
      return
    }
    didRun.current = true
    if (isAuthenticated) {
      dispatch(authLogout())
      toast.success("Сессия завершена", { title: "Выход выполнен" })
    }
    navigate("/")
  }, [dispatch, navigate, isAuthenticated])

  return null
}

export default Logout
