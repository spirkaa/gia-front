import isEqual from "lodash/isEqual"
import { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { toast } from "react-toastify"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { authRegistration, authRegistrationMsgRemove } from "../actions"
import { EMAIL_REGEX } from "../utils"

function validate(email, password1, password2) {
  return {
    email: !EMAIL_REGEX.test(email),
    password1: password1.length === 0,
    password2: password2.length === 0,
  }
}

class Registration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emailValid: null,
      password1Valid: null,
      password2Valid: null,
      email: "",
      password1: "",
      password2: "",
      touched: {
        email: false,
        password1: false,
        password2: false,
      },
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps, this.props)) {
      this.setState({
        emailValid: null,
        password1Valid: null,
        password2Valid: null,
      })
      if (!isEqual(prevProps.authRegMsg, this.props.authRegMsg)) {
        const message = this.props.authRegMsg
        if (message.non_field_errors) {
          message.non_field_errors.map((msg) => toast.error(msg, { title: "Ошибка" }))
        }
        if (message.email) {
          this.setState({ emailValid: "error" })
        }
        if (message.password1) {
          this.setState({ password1Valid: "error" })
        }
        if (message.password2) {
          this.setState({ password2Valid: "error" })
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.authRegistrationMsgRemove()
  }

  canBeSubmitted() {
    const errors = validate(
      this.state.email,
      this.state.password1,
      this.state.password2,
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
    const { email, password1, password2 } = this.state
    this.props.authRegistration(email, password1, password2)
  }

  render() {
    const header = "Регистрация"
    const subheader = "Зарегистрируйтесь, чтобы подписаться на обновления в расписании"

    const { email, password1, password2 } = this.props.authRegMsg
    const { emailValid, password1Valid, password2Valid } = this.state

    const errors = validate(
      this.state.email,
      this.state.password1,
      this.state.password2,
    )
    const isDisabled = Object.keys(errors).some((x) => errors[x])

    const shouldMarkError = (field) => {
      const hasError = errors[field]
      const shouldShow = this.state.touched[field]
      return hasError ? shouldShow : false
    }

    return (
      <Row className="bottom-buffer">
        <Header header={header} subHeader={subheader} />
        <Col sm={4}>{""}</Col>
        <Col sm={4}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Электронная почта</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur("email")}
                isInvalid={!!(shouldMarkError("email") || emailValid)}
              />
              {emailValid
                ? email.map((msg, i) => (
                    <Form.Control.Feedback key={i} type="invalid">
                      {msg}
                    </Form.Control.Feedback>
                  ))
                : null}
              {shouldMarkError("email") ? (
                <Form.Control.Feedback type="invalid">
                  Введите корректный адрес электронной почты.
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group controlId="formPassword1">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password1"
                value={this.state.password1}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur("password1")}
                isInvalid={!!(shouldMarkError("password1") || password1Valid)}
              />
              {password1Valid
                ? password1.map((msg, i) => (
                    <Form.Control.Feedback key={i} type="invalid">
                      {msg}
                    </Form.Control.Feedback>
                  ))
                : null}
            </Form.Group>
            <Form.Group controlId="formPassword2">
              <Form.Label>Повторите пароль</Form.Label>
              <Form.Control
                type="password"
                name="password2"
                value={this.state.password2}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur("password2")}
                isInvalid={!!(shouldMarkError("password2") || password2Valid)}
              />
              {password2Valid
                ? password2.map((msg, i) => (
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
              disabled={this.props.isRegistering || isDisabled}>
              {this.props.isRegistering
                ? "Пожалуйста, подождите..."
                : "Зарегистрироваться"}
            </Button>
          </Form>
          <hr />
          <p>
            Уже есть учетная запись? <Link to="/login">Войти</Link>
          </p>
        </Col>
        <Col sm={4}>{""}</Col>
      </Row>
    )
  }
}

Registration.propTypes = {
  isRegistering: PropTypes.bool.isRequired,
  authRegMsg: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  isRegistering: state.auth.isRegistering,
  authRegMsg: state.auth.authRegMsg,
})

export default connect(mapStateToProps, {
  authRegistration,
  authRegistrationMsgRemove,
})(Registration)
