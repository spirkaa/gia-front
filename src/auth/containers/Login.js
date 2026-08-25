import isEqual from "lodash/isEqual"
import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { authLogin, authLoginMsgRemove, authRememberMe } from "../actions"
import { EMAIL_REGEX } from "../utils"

function validate(email, password) {
  return {
    email: !EMAIL_REGEX.test(email),
    password: password.length === 0,
  }
}

const Login = () => {
  const dispatch = useDispatch()

  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating)
  const authLoginMsg = useSelector((state) => state.auth.authLoginMsg)

  const [emailValid, setEmailValid] = useState(null)
  const [passwordValid, setPasswordValid] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const prevMsg = useRef(authLoginMsg)
  useEffect(() => {
    setEmailValid(null)
    setPasswordValid(null)
    if (!isEqual(authLoginMsg, prevMsg.current)) {
      const message = authLoginMsg
      if (message.non_field_errors) {
        message.non_field_errors.map((msg) => toast.error(msg, { title: "Ошибка" }))
      }
      if (message.email) {
        setEmailValid("error")
      }
      if (message.password) {
        setPasswordValid("error")
      }
      prevMsg.current = authLoginMsg
    }
  }, [authLoginMsg])

  useEffect(
    () => () => {
      dispatch(authLoginMsgRemove())
    },
    [dispatch],
  )

  const canBeSubmitted = () => {
    const errors = validate(email, password)
    const isDisabled = Object.keys(errors).some((x) => errors[x])
    return !isDisabled
  }

  const handleBlur = (field) => (evt) => {
    setTouched({ ...touched, [field]: true })
  }

  const handleInputChange = (evt) => {
    const target = evt.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    if (name === "rememberMe") {
      setRememberMe(value)
    } else if (name === "email") {
      setEmail(value)
    } else {
      setPassword(value)
    }
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    if (!canBeSubmitted()) {
      return
    }
    dispatch(authLogin(email, password))
    dispatch(authRememberMe(rememberMe))
  }

  const header = "Вход"
  const subheader = "Введите данные учетной записи"

  const { email: emailErrors, password: passwordErrors } = authLoginMsg

  const errors = validate(email, password)
  const isDisabled = Object.keys(errors).some((x) => errors[x])

  const shouldMarkError = (field) => {
    const hasError = errors[field]
    const shouldShow = touched[field]
    return hasError ? shouldShow : false
  }

  return (
    <Row className="bottom-buffer">
      <Header header={header} subHeader={subheader} />
      <Col sm={4}>{""}</Col>
      <Col sm={4}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Электронная почта</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              onBlur={handleBlur("email")}
              isInvalid={!!(shouldMarkError("email") || emailValid)}
            />
            {emailValid
              ? emailErrors.map((msg) => (
                  <Form.Control.Feedback type="invalid">{msg}</Form.Control.Feedback>
                ))
              : null}
            {shouldMarkError("email") ? (
              <Form.Control.Feedback type="invalid">
                Введите корректный адрес электронной почты.
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              onBlur={handleBlur("password")}
              isInvalid={!!(shouldMarkError("password") || passwordValid)}
            />
            {passwordValid
              ? passwordErrors.map((msg) => (
                  <Form.Control.Feedback type="invalid">{msg}</Form.Control.Feedback>
                ))
              : null}
            {shouldMarkError("password") ? (
              <Form.Control.Feedback type="invalid">
                Пароль не может быть пустым.
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
          <Form.Check
            type="checkbox"
            name="rememberMe"
            label="Запомнить"
            checked={rememberMe}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            className="w-100 mt-3"
            variant="primary"
            disabled={isAuthenticating || isDisabled}>
            Войти
          </Button>
        </Form>
        <hr />
        <p>
          <Link to="/password-reset">Забыли пароль?</Link>
        </p>
        <p>
          <Link to="/registration">Регистрация</Link>
        </p>
      </Col>
      <Col sm={4}>{""}</Col>
    </Row>
  )
}

export default Login
