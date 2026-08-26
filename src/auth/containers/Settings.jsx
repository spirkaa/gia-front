import isEqual from "lodash/isEqual"
import { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { toast } from "react-toastify"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import {
  modalShow,
  authInfo,
  authInfoUpdate,
  authInfoUpdateMsgRemove,
  authLogout,
} from "../actions"
import SettingsPassword from "./SettingsPassword"

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.user.email,
      first_name: props.user.first_name || "",
      last_name: props.user.last_name || "",
    }
  }

  componentDidMount() {
    this.props.authInfo(this.props.token)
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.user, this.props.user)) {
      this.setState({
        first_name: this.props.user.first_name || "",
        last_name: this.props.user.last_name || "",
      })
    }
    if (!isEqual(prevProps.authInfoUpdateMsg, this.props.authInfoUpdateMsg)) {
      const message = this.props.authInfoUpdateMsg
      if (message.non_field_errors) {
        message.non_field_errors.map((msg) => toast.error(msg, { title: "Ошибка" }))
      }
      if (message.detail) {
        if (message.detail === "Signature has expired.") {
          toast.error("Требуется повторный вход", { title: "Сессия истекла" })
          this.props.authLogout()
        } else {
          toast.success(message.detail)
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.authInfoUpdateMsgRemove()
  }

  handleInputChange = (evt) => {
    const target = evt.target
    const value = target.value
    const name = target.name
    this.setState({ [name]: value })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    this.props.authInfoUpdate(
      this.props.token,
      this.state.first_name,
      this.state.last_name,
    )
  }

  render() {
    const { isInfoUpdateRequesting, modalShow } = this.props
    const header = "Настройки"
    const subheader = "Личная информация"
    return (
      <Row className="bottom-buffer">
        <Header header={header} subHeader={subheader} />
        <Col sm={4}>{""}</Col>
        <Col sm={4}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Электронная почта</Form.Label>
              <div className="form-control-plaintext">{this.state.email}</div>
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                placeholder="Укажите имя"
                value={this.state.first_name}
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Фамилия</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                placeholder="Укажите фамилию"
                value={this.state.last_name}
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <p>
              <Button className="w-100 mt-3" onClick={modalShow}>
                Изменить пароль
              </Button>
            </p>
            <Button
              type="submit"
              className="w-100"
              variant="primary"
              disabled={isInfoUpdateRequesting}>
              Сохранить
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{""}</Col>
        <SettingsPassword />
      </Row>
    )
  }
}

Settings.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  isInfoUpdateRequesting: PropTypes.bool.isRequired,
  authInfoUpdateMsg: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  user: state.auth.user,
  isInfoUpdateRequesting: state.auth.isInfoUpdateRequesting,
  authInfoUpdateMsg: state.auth.authInfoUpdateMsg,
})

export default connect(mapStateToProps, {
  modalShow,
  authLogout,
  authInfo,
  authInfoUpdate,
  authInfoUpdateMsgRemove,
})(Settings)
