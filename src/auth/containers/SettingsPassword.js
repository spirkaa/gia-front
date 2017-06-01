import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Modal } from 'react-bootstrap'

import { modalHide, modalShow, userLogout, userPasswordChange, userPasswordChangeErrorsRemove } from '../actions'

class SettingsPassword extends Component {

  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    this.state = {
      oldPasswordValid: null,
      newPassword1Valid: null,
      newPassword2Valid: null
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      oldPasswordValid: null,
      newPassword1Valid: null,
      newPassword2Valid: null
    })

    const message = nextProps.userPasswordChangeErrors
    if (message.non_field_errors) {
      toastr.error('Ошибка', message.non_field_errors[ 0 ])
    }
    if (message.old_password) {
      this.setState({ oldPasswordValid: 'error' })
    }
    if (message.new_password1) {
      this.setState({ newPassword1Valid: 'error' })
    }
    if (message.new_password2) {
      this.setState({ newPassword2Valid: 'error' })
    }
    if (message.detail) {
      if (message.detail === 'Signature has expired.') {
        toastr.error('Сессия истекла', 'Требуется вход')
        this.props.userLogout()
      }
      else {
        toastr.success('', message.detail)
      }
    }
  }

  componentWillUnmount () {
    this.props.userPasswordChangeErrorsRemove()
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.userPasswordChange(
      this.props.token,
      findDOMNode(this.refs.oldPassword).value,
      findDOMNode(this.refs.newPassword1).value,
      findDOMNode(this.refs.newPassword2).value
    )
  }

  close () {
    this.props.modalHide()
  }

  open () {
    this.props.modalShow()
  }

  render () {
    const { old_password, new_password1, new_password2 } = this.props.userPasswordChangeErrors
    const { oldPasswordValid, newPassword1Valid, newPassword2Valid } = this.state
    return (
      <Modal bsSize='small' show={this.props.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить пароль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup controlId='formOldPassword' validationState={oldPasswordValid}>
              <ControlLabel>Старый пароль</ControlLabel>
              <FormControl
                type='password'
                ref='oldPassword'
                onKeyUp={this.handleKeyUp}/>
              {oldPasswordValid
                ? <HelpBlock>{old_password[ 0 ]}</HelpBlock>
                : null }
            </FormGroup>
            <FormGroup controlId='formNewPassword1' validationState={newPassword1Valid}>
              <ControlLabel>Новый пароль</ControlLabel>
              <FormControl
                type='password'
                ref='newPassword1'
                onKeyUp={this.handleKeyUp}/>
              {newPassword1Valid
                ? <HelpBlock>{new_password1[ 0 ]}</HelpBlock>
                : null }
            </FormGroup>
            <FormGroup controlId='formNewPassword2' validationState={newPassword2Valid}>
              <ControlLabel>Повторите пароль</ControlLabel>
              <FormControl
                type='password'
                ref='newPassword2'
                onKeyUp={this.handleKeyUp}/>
              {newPassword2Valid
                ? <HelpBlock>{new_password2[ 0 ]}</HelpBlock>
                : null }
            </FormGroup>
            <Button
              block
              bsStyle='primary'
              onClick={this.handleButtonClick}
              disabled={this.props.isPasswordChangeRequesting}>
              Сохранить
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  showModal: state.auth.showModal,
  isPasswordChangeRequesting: state.auth.isPasswordChangeRequesting,
  userPasswordChangeErrors: state.auth.userPasswordChangeErrors
})

export default connect(mapStateToProps, {
  modalShow,
  modalHide,
  userLogout,
  userPasswordChange,
  userPasswordChangeErrorsRemove
})(SettingsPassword)