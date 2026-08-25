import isEqual from "lodash/isEqual"
import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { authRegMailVerifyMsgRemove, authRegVerifyMail } from "../actions"

const RegistrationEmailConfirm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { key } = useParams()

  const isMailVerifying = useSelector((state) => state.auth.isMailVerifying)
  const authRegVerifyMailMsg = useSelector((state) => state.auth.authRegVerifyMailMsg)

  const prevMsg = useRef(authRegVerifyMailMsg)
  useEffect(() => {
    if (!isEqual(authRegVerifyMailMsg, prevMsg.current)) {
      const message = authRegVerifyMailMsg
      if (message.non_field_errors) {
        message.non_field_errors.map((msg) => toast.error(msg, { title: "Ошибка" }))
      }
      if (message.key) {
        toast.error(message.key[0], { title: "Ошибка" })
      }
      if (message.detail) {
        toast.success("Почтовый адрес подтвержден")
        navigate("/")
      }
      prevMsg.current = authRegVerifyMailMsg
    }
  }, [authRegVerifyMailMsg, navigate])

  useEffect(
    () => () => {
      dispatch(authRegMailVerifyMsgRemove())
    },
    [dispatch],
  )

  const handleSubmit = (evt) => {
    evt.preventDefault()
    dispatch(authRegVerifyMail(key))
  }

  const header = "Подтверждение почтового адреса"
  const subheader = "Нажмите на кнопку"
  return (
    <Row className="bottom-buffer">
      <Header header={header} subHeader={subheader} />
      <Col sm={4}>{""}</Col>
      <Col sm={4}>
        <Form onSubmit={handleSubmit}>
          <Button
            type="submit"
            className="w-100"
            variant="primary"
            disabled={isMailVerifying}>
            Подтвердить адрес
          </Button>
        </Form>
      </Col>
      <Col sm={4}>{""}</Col>
    </Row>
  )
}

export default RegistrationEmailConfirm
