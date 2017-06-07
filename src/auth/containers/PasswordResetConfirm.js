import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { authPasswordResetConfirm, authPasswordResetConfirmMsgRemove } from '../actions'

function validate (new_password1, new_password2) {
  return {
    new_password1: new_password1.length === 0,
    new_password2: new_password2.length === 0,
  }
}

class PasswordResetConfirm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      newPassword1Valid: null,
      newPassword2Valid: null,
      new_password1: '',
      new_password2: '',
      touched: {
        new_password1: false,
        new_password2: false,
      },
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      newPassword1Valid: null,
      newPassword2Valid: null,
    })

    if (!isEqual(nextProps.authPasswordResetConfirmMsg, this.props.authPasswordResetConfirmMsg)) {
      const message = nextProps.authPasswordResetConfirmMsg
      if (message.non_field_errors) {
        message.non_field_errors.map(msg => toastr.error('Ошибка', msg))
      }
      if (message.new_password1) {
        this.setState({ newPassword1Valid: 'error' })
      }
      if (message.new_password2) {
        this.setState({ newPassword2Valid: 'error' })
      }
      if (message.detail) {
        toastr.success('', message.detail)
        this.props.history.push('/login')
      }
    }
  }

  componentWillUnmount () {
    this.props.authPasswordResetConfirmMsgRemove()
  }

  canBeSubmitted () {
    const errors = validate(this.state.new_password1, this.state.new_password2)
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
    const { uid, token } = this.props.match.params
    this.props.authPasswordResetConfirm(
      uid,
      token,
      this.state.new_password1,
      this.state.new_password2,
    )
  }

  render () {
    const header = 'Восстановление пароля'
    const subheader = 'Укажите новый пароль'

    const { new_password1, new_password2 } = this.props.authPasswordResetConfirmMsg
    const { newPassword1Valid, newPassword2Valid } = this.state

    const errors = validate(this.state.new_password1, this.state.new_password2)
    const isDisabled = Object.keys(errors).some(x => errors[ x ])

    const shouldMarkError = (field) => {
      const hasError = errors[ field ]
      const shouldShow = this.state.touched[ field ]
      return hasError ? shouldShow : false
    }

    return (
      <Row className='bottom-buffer'>
        <Header header={header} subHeader={subheader}/>
        <Col sm={4}>{''}</Col>
        <Col sm={4}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup controlId='formNewPassword1'
                       validationState={shouldMarkError('new_password1') || newPassword1Valid
                         ? 'error'
                         : null}>
              <ControlLabel>Новый пароль</ControlLabel>
              <FormControl
                type='password'
                name='new_password1'
                value={this.state.new_password1}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('new_password1')}/>
              {newPassword1Valid
                ? new_password1.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
            </FormGroup>
            <FormGroup controlId='formNewPassword2'
                       validationState={shouldMarkError('new_password2') || newPassword2Valid
                         ? 'error'
                         : null}>
              <ControlLabel>Повторите пароль</ControlLabel>
              <FormControl
                type='password'
                name='new_password2'
                value={this.state.new_password2}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('new_password2')}/>
              {newPassword2Valid
                ? new_password2.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
            </FormGroup>
            <Button
              type='submit'
              block
              bsStyle='primary'
              disabled={this.props.isPasswordResetConfirming || isDisabled}>
              Отправить
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

PasswordResetConfirm.propTypes = {
  isPasswordResetConfirming: PropTypes.bool.isRequired,
  authPasswordResetConfirmMsg: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  isPasswordResetConfirming: state.auth.isPasswordResetConfirming,
  authPasswordResetConfirmMsg: state.auth.authPasswordResetConfirmMsg,
})

export default connect(mapStateToProps, {
  authPasswordResetConfirm,
  authPasswordResetConfirmMsgRemove,
})(PasswordResetConfirm)