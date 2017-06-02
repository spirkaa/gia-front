import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Modal } from 'react-bootstrap'

import { modalHide, userLogout, userPasswordChange, userPasswordChangeErrorsRemove } from '../actions'

function validate (oldPassword, newPassword1, newPassword2) {
  return {
    oldPassword: oldPassword.length === 0,
    newPassword1: newPassword1.length === 0,
    newPassword2: newPassword2.length === 0,
  }
}

class SettingsPassword extends Component {

  constructor (props) {
    super(props)
    this.state = {
      oldPasswordValid: null,
      newPassword1Valid: null,
      newPassword2Valid: null,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      touched: {
        oldPassword: false,
        newPassword1: false,
        newPassword2: false,
      },
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      oldPasswordValid: null,
      newPassword1Valid: null,
      newPassword2Valid: null,
    })

    if (!isEqual(nextProps.userPasswordChangeErrors, this.props.userPasswordChangeErrors)) {
      const message = nextProps.userPasswordChangeErrors
      if (message.non_field_errors) {
        message.non_field_errors.map(msg => toastr.error('Ошибка', msg))
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
  }

  componentWillUnmount () {
    this.props.userPasswordChangeErrorsRemove()
  }

  canBeSubmitted () {
    const errors = validate(this.state.oldPassword, this.state.newPassword1, this.state.newPassword2)
    const isDisabled = Object.keys(errors).some(x => errors[ x ])
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
    this.props.userPasswordChange(
      this.props.token,
      oldPassword,
      newPassword1,
      newPassword2,
    )
  }

  render () {
    const { showModal, modalHide, isPasswordChangeRequesting } = this.props
    const { old_password, new_password1, new_password2 } = this.props.userPasswordChangeErrors
    const { oldPassword, newPassword1, newPassword2, oldPasswordValid, newPassword1Valid, newPassword2Valid } = this.state

    const errors = validate(this.state.oldPassword, this.state.newPassword1, this.state.newPassword2)
    const isDisabled = Object.keys(errors).some(x => errors[ x ])

    const shouldMarkError = (field) => {
      const hasError = errors[ field ]
      const shouldShow = this.state.touched[ field ]
      return hasError ? shouldShow : false
    }

    return (
      <Modal show={showModal} onHide={modalHide}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить пароль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup controlId='formOldPassword'
                       validationState={shouldMarkError('oldPassword') || oldPasswordValid
                         ? 'error'
                         : null}>
              <ControlLabel>Старый пароль</ControlLabel>
              <FormControl
                type='password'
                name='oldPassword'
                value={oldPassword}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('oldPassword')}/>
              {oldPasswordValid
                ? old_password.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
            </FormGroup>
            <FormGroup controlId='formNewPassword1'
                       validationState={shouldMarkError('newPassword1') || newPassword1Valid
                         ? 'error'
                         : null}>
              <ControlLabel>Новый пароль</ControlLabel>
              <FormControl
                type='password'
                name='newPassword1'
                value={newPassword1}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('newPassword1')}/>
              {newPassword1Valid
                ? new_password1.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
            </FormGroup>
            <FormGroup controlId='formNewPassword2'
                       validationState={shouldMarkError('newPassword2') || newPassword2Valid
                         ? 'error'
                         : null}>
              <ControlLabel>Повторите пароль</ControlLabel>
              <FormControl
                type='password'
                name='newPassword2'
                value={newPassword2}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('newPassword2')}/>
              {newPassword2Valid
                ? new_password2.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
            </FormGroup>
            <Button
              type='submit'
              block
              bsStyle='primary'
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
  userPasswordChangeErrors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  showModal: state.auth.showModal,
  isPasswordChangeRequesting: state.auth.isPasswordChangeRequesting,
  userPasswordChangeErrors: state.auth.userPasswordChangeErrors,
})

export default connect(mapStateToProps, {
  modalHide,
  userLogout,
  userPasswordChange,
  userPasswordChangeErrorsRemove,
})(SettingsPassword)