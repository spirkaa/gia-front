import isEqual from "lodash/isEqual"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { authPasswordResetConfirm, authPasswordResetConfirmMsgRemove } from "../actions"

function validate(new_password1, new_password2) {
  return {
    new_password1: new_password1.length === 0,
    new_password2: new_password2.length === 0,
  }
}

const PasswordResetConfirm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uid, token } = useParams()

  const isPasswordResetConfirming = useSelector(
    (state) => state.auth.isPasswordResetConfirming,
  )
  const authPasswordResetConfirmMsg = useSelector(
    (state) => state.auth.authPasswordResetConfirmMsg,
  )

  const [newPassword1Valid, setNewPassword1Valid] = useState(null)
  const [newPassword2Valid, setNewPassword2Valid] = useState(null)
  const [new_password1, setNewPassword1] = useState("")
  const [new_password2, setNewPassword2] = useState("")
  const [touched, setTouched] = useState({
    new_password1: false,
    new_password2: false,
  })

  const prevMsg = useRef(authPasswordResetConfirmMsg)
  useEffect(() => {
    setNewPassword1Valid(null)
    setNewPassword2Valid(null)
    if (!isEqual(authPasswordResetConfirmMsg, prevMsg.current)) {
      const message = authPasswordResetConfirmMsg
      if (message.non_field_errors) {
        message.non_field_errors.map((msg) => toast.error(msg, { title: "Ошибка" }))
      }
      if (message.new_password1) {
        setNewPassword1Valid("error")
      }
      if (message.new_password2) {
        setNewPassword2Valid("error")
      }
      if (message.detail) {
        toast.success(message.detail)
        navigate("/login")
      }
      prevMsg.current = authPasswordResetConfirmMsg
    }
  }, [authPasswordResetConfirmMsg, navigate])

  useEffect(
    () => () => {
      dispatch(authPasswordResetConfirmMsgRemove())
    },
    [dispatch],
  )

  const canBeSubmitted = () => {
    const errors = validate(new_password1, new_password2)
    const isDisabled = Object.keys(errors).some((x) => errors[x])
    return !isDisabled
  }

  const handleBlur = (field) => (evt) => {
    setTouched({ ...touched, [field]: true })
  }

  const handleInputChange = (evt) => {
    const target = evt.target
    const value = target.value
    const name = target.name
    if (name === "new_password1") {
      setNewPassword1(value)
    } else {
      setNewPassword2(value)
    }
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    if (!canBeSubmitted()) {
      return
    }
    dispatch(authPasswordResetConfirm(uid, token, new_password1, new_password2))
  }

  const header = "Восстановление пароля"
  const subheader = "Укажите новый пароль"

  const { new_password1: password1Errors, new_password2: password2Errors } =
    authPasswordResetConfirmMsg

  const errors = validate(new_password1, new_password2)
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
          <Form.Group controlId="formNewPassword1">
            <Form.Label>Новый пароль</Form.Label>
            <Form.Control
              type="password"
              name="new_password1"
              value={new_password1}
              onChange={handleInputChange}
              onBlur={handleBlur("new_password1")}
              isInvalid={!!(shouldMarkError("new_password1") || newPassword1Valid)}
            />
            {newPassword1Valid
              ? password1Errors.map((msg, i) => (
                  <Form.Control.Feedback key={i} type="invalid">
                    {msg}
                  </Form.Control.Feedback>
                ))
              : null}
          </Form.Group>
          <Form.Group controlId="formNewPassword2">
            <Form.Label>Повторите пароль</Form.Label>
            <Form.Control
              type="password"
              name="new_password2"
              value={new_password2}
              onChange={handleInputChange}
              onBlur={handleBlur("new_password2")}
              isInvalid={!!(shouldMarkError("new_password2") || newPassword2Valid)}
            />
            {newPassword2Valid
              ? password2Errors.map((msg, i) => (
                  <Form.Control.Feedback key={i} type="invalid">
                    {msg}
                  </Form.Control.Feedback>
                ))
              : null}
          </Form.Group>
          <Button
            type="submit"
            className="w-100 mt-3"
            variant="primary"
            disabled={isPasswordResetConfirming || isDisabled}>
            Отправить
          </Button>
        </Form>
      </Col>
      <Col sm={4}>{""}</Col>
    </Row>
  )
}

export default PasswordResetConfirm
