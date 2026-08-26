import isEqual from "lodash/isEqual"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { authPasswordReset, authPasswordResetMsgRemove } from "../actions"
import { EMAIL_REGEX } from "../utils"

function validate(email) {
  return !EMAIL_REGEX.test(email)
}

const PasswordReset = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isPasswordMailSending = useSelector((state) => state.auth.isPasswordMailSending)
  const authPasswordResetMsg = useSelector((state) => state.auth.authPasswordResetMsg)

  const [emailValid, setEmailValid] = useState(null)
  const [email, setEmail] = useState("")
  const [touched, setTouched] = useState(false)

  const prevMsg = useRef(authPasswordResetMsg)
  useEffect(() => {
    setEmailValid(null)
    if (!isEqual(authPasswordResetMsg, prevMsg.current)) {
      const message = authPasswordResetMsg
      if (message.non_field_errors) {
        message.non_field_errors.map((msg) => toast.error(msg, { title: "Ошибка" }))
      }
      if (message.email) {
        setEmailValid("error")
      }
      if (message.detail) {
        toast.success(message.detail)
        navigate("/password-reset/email-sent")
      }
      prevMsg.current = authPasswordResetMsg
    }
  }, [authPasswordResetMsg, navigate])

  useEffect(
    () => () => {
      dispatch(authPasswordResetMsgRemove())
    },
    [dispatch],
  )

  const canBeSubmitted = () => validate(email)

  const handleBlur = (evt) => {
    setTouched(true)
  }

  const handleInputChange = (evt) => {
    setEmail(evt.target.value)
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    if (canBeSubmitted()) {
      return
    }
    dispatch(authPasswordReset(email))
  }

  const header = "Восстановление пароля"
  const subheader = "Введите email, указанный при регистрации"

  const { email: emailErrors } = authPasswordResetMsg

  const errors = validate(email)
  const shouldMarkError = errors ? touched : false

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
              onBlur={handleBlur}
              isInvalid={!!(shouldMarkError || emailValid)}
            />
            {emailValid
              ? emailErrors.map((msg, i) => (
                  <Form.Control.Feedback key={i} type="invalid">
                    {msg}
                  </Form.Control.Feedback>
                ))
              : null}
            {shouldMarkError ? (
              <Form.Control.Feedback type="invalid">
                Введите корректный адрес электронной почты.
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
          <Button
            type="submit"
            className="w-100 mt-3"
            variant="primary"
            disabled={isPasswordMailSending || errors}>
            {isPasswordMailSending ? "Пожалуйста, подождите..." : "Восстановить пароль"}
          </Button>
        </Form>
      </Col>
      <Col sm={4}>{""}</Col>
    </Row>
  )
}

export default PasswordReset
