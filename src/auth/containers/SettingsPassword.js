import isEqual from "lodash/isEqual"
import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { toast } from "react-toastify"
import { Button, Form, Modal } from "react-bootstrap"

import {
  modalHide,
  authLogout,
  authPasswordChange,
  authPasswordChangeMsgRemove,
} from "../actions"

function validate(oldPassword, newPassword1, newPassword2) {
  return {
    oldPassword: oldPassword.length === 0,
    newPassword1: newPassword1.length === 0,
    newPassword2: newPassword2.length === 0,
  }
}

class SettingsPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldPasswordValid: null,
      newPassword1Valid: null,
      newPassword2Valid: null,
      oldPassword: "",
      newPassword1: "",
      newPassword2: "",
      touched: {
        oldPassword: false,
        newPassword1: false,
        newPassword2: false,
      },
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps, this.props)) {
      this.setState({
        oldPasswordValid: null,
        newPassword1Valid: null,
        newPassword2Valid: null,
      })

      if (!isEqual(prevProps.authPasswordChangeMsg, this.props.authPasswordChangeMsg)) {
        const message = this.props.authPasswordChangeMsg
        if (message.non_field_errors) {
          message.non_field_errors.map((msg) => toast.error(msg, { title: "Ошибка" }))
        }
        if (message.old_password) {
          this.setState({ oldPasswordValid: "error" })
        }
        if (message.new_password1) {
          this.setState({ newPassword1Valid: "error" })
        }
        if (message.new_password2) {
          this.setState({ newPassword2Valid: "error" })
        }
        if (message.detail) {
          if (message.detail === "Signature has expired.") {
            toast.error("Требуется вход", { title: "Сессия истекла" })
            this.props.authLogout()
          } else {
            toast.success(message.detail)
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.authPasswordChangeMsgRemove()
  }

  canBeSubmitted() {
    const errors = validate(
      this.state.oldPassword,
      this.state.newPassword1,
      this.state.newPassword2,
    )
    const isDisabled = Object.keys(errors).some((x) => errors[x])
    return !isDisabled
  }

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    })
  }

  handleInputChange = (evt) => {
    const target = evt.target
    const value = target.value
    const name = target.name
    this.setState({ [name]: value })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    if (!this.canBeSubmitted()) {
      return
    }
    const { oldPassword, newPassword1, newPassword2 } = this.state
    this.props.authPasswordChange(
      this.props.token,
      oldPassword,
      newPassword1,
      newPassword2,
    )
  }

  render() {
    const { showModal, modalHide, isPasswordChangeRequesting } = this.props
    const { old_password, new_password1, new_password2 } =
      this.props.authPasswordChangeMsg
    const {
      oldPassword,
      newPassword1,
      newPassword2,
      oldPasswordValid,
      newPassword1Valid,
      newPassword2Valid,
    } = this.state

    const errors = validate(
      this.state.oldPassword,
      this.state.newPassword1,
      this.state.newPassword2,
    )
    const isDisabled = Object.keys(errors).some((x) => errors[x])

    const shouldMarkError = (field) => {
      const hasError = errors[field]
      const shouldShow = this.state.touched[field]
      return hasError ? shouldShow : false
    }

    return (
      <Modal size="sm" show={showModal} onHide={modalHide}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить пароль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formOldPassword">
              <Form.Label>Старый пароль</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur("oldPassword")}
                isInvalid={!!(shouldMarkError("oldPassword") || oldPasswordValid)}
              />
              {oldPasswordValid
                ? old_password.map((msg) => (
                    <Form.Control.Feedback type="invalid">{msg}</Form.Control.Feedback>
                  ))
                : null}
            </Form.Group>
            <Form.Group controlId="formNewPassword1">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                name="newPassword1"
                value={newPassword1}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur("newPassword1")}
                isInvalid={!!(shouldMarkError("newPassword1") || newPassword1Valid)}
              />
              {newPassword1Valid
                ? new_password1.map((msg) => (
                    <Form.Control.Feedback type="invalid">{msg}</Form.Control.Feedback>
                  ))
                : null}
            </Form.Group>
            <Form.Group controlId="formNewPassword2">
              <Form.Label>Повторите пароль</Form.Label>
              <Form.Control
                type="password"
                name="newPassword2"
                value={newPassword2}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur("newPassword2")}
                isInvalid={!!(shouldMarkError("newPassword2") || newPassword2Valid)}
              />
              {newPassword2Valid
                ? new_password2.map((msg) => (
                    <Form.Control.Feedback type="invalid">{msg}</Form.Control.Feedback>
                  ))
                : null}
            </Form.Group>
            <Button
              type="submit"
              className="w-100 mt-3"
              variant="primary"
              disabled={isPasswordChangeRequesting || isDisabled}>
              Сохранить
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}

SettingsPassword.propTypes = {
  token: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  isPasswordChangeRequesting: PropTypes.bool.isRequired,
  authPasswordChangeMsg: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  showModal: state.auth.showModal,
  isPasswordChangeRequesting: state.auth.isPasswordChangeRequesting,
  authPasswordChangeMsg: state.auth.authPasswordChangeMsg,
})

export default connect(mapStateToProps, {
  modalHide,
  authLogout,
  authPasswordChange,
  authPasswordChangeMsgRemove,
})(SettingsPassword)
