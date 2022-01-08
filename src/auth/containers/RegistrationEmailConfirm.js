import isEqual from "lodash/isEqual"
import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { toastr } from "react-redux-toastr"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { authRegMailVerifyMsgRemove, authRegVerifyMail } from "../actions"

class RegistrationEmailConfirm extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.authRegVerifyMailMsg, this.props.authRegVerifyMailMsg)) {
      const message = nextProps.authRegVerifyMailMsg
      if (message.non_field_errors) {
        message.non_field_errors.map((msg) => toastr.error("Ошибка", msg))
      }
      if (message.key) {
        toastr.error("Ошибка", message.key[0])
      }
      if (message.detail) {
        toastr.success("", "Почтовый адрес подтвержден")
        this.props.navigate("/")
      }
    }
  }

  componentWillUnmount() {
    this.props.authRegMailVerifyMsgRemove()
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    this.props.authRegVerifyMail(this.props.match.params.key)
  }

  render() {
    const header = "Подтверждение почтового адреса"
    const subheader = "Нажмите на кнопку"
    return (
      <Row className="bottom-buffer">
        <Header header={header} subHeader={subheader} />
        <Col sm={4}>{""}</Col>
        <Col sm={4}>
          <Form onSubmit={this.handleSubmit}>
            <Button
              type="submit"
              block
              bsStyle="primary"
              disabled={this.props.isMailVerifying}>
              Подтвердить адрес
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{""}</Col>
      </Row>
    )
  }
}

RegistrationEmailConfirm.propTypes = {
  isMailVerifying: PropTypes.bool.isRequired,
  authRegVerifyMailMsg: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  isMailVerifying: state.auth.isMailVerifying,
  authRegVerifyMailMsg: state.auth.authRegVerifyMailMsg,
})

export default connect(mapStateToProps, {
  authRegVerifyMail,
  authRegMailVerifyMsgRemove,
})(RegistrationEmailConfirm)
