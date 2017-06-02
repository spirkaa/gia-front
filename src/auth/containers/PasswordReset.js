import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { userPasswordReset, userPasswordResetErrorsRemove } from '../actions'
import { EMAIL_REGEX } from '../constants'

function validate (email) {
  return !EMAIL_REGEX.test(email)
}

class PasswordReset extends Component {

  constructor (props) {
    super(props)
    this.state = {
      emailValid: null,
      email: '',
      touched: false,
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      emailValid: null,
    })

    if (!isEqual(nextProps.userPasswordResetErrors, this.props.userPasswordResetErrors)) {
      const message = nextProps.userPasswordResetErrors
      if (message.non_field_errors) {
        message.non_field_errors.map(msg => toastr.error('Ошибка', msg))
      }
      if (message.email) {
        this.setState({ emailValid: 'error' })
      }
      if (message.detail) {
        toastr.success('', message.detail)
        this.props.history.push('/password-reset/email-sent')
      }
    }
  }

  componentWillUnmount () {
    this.props.userPasswordResetErrorsRemove()
  }

  canBeSubmitted () {
    return validate(this.state.email)
  }

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: true,
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
    if (this.canBeSubmitted()) {
      return
    }
    this.props.userPasswordReset(
      this.state.email,
    )
  }

  render () {
    const header = 'Восстановление пароля'
    const subheader = 'Введите email, указанный при регистрации'

    const { email } = this.props.userPasswordResetErrors
    const { emailValid } = this.state

    const errors = validate(this.state.email)
    const shouldMarkError = errors ? this.state.touched : false

    return (
      <Row className='bottom-buffer'>
        <Header header={header} subHeader={subheader}/>
        <Col sm={4}>{''}</Col>
        <Col sm={4}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup controlId='formEmail'
                       validationState={shouldMarkError || emailValid
                         ? 'error'
                         : null}>
              <ControlLabel>Электронная почта</ControlLabel>
              <FormControl
                type='email'
                name='email'
                value={this.state.email}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('email')}/>
              {emailValid
                ? email.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
              {shouldMarkError
                ? <HelpBlock>Введите корректный адрес электронной почты.</HelpBlock>
                : null}
            </FormGroup>
            <Button
              type='submit'
              block
              bsStyle='primary'
              disabled={this.props.isPasswordMailSending || errors}>
              Восстановить пароль
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

PasswordReset.propTypes = {
  isPasswordMailSending: PropTypes.bool.isRequired,
  userPasswordResetErrors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  isPasswordMailSending: state.auth.isPasswordMailSending,
  userPasswordResetErrors: state.auth.userPasswordResetErrors,
})

export default connect(mapStateToProps, {
  userPasswordReset,
  userPasswordResetErrorsRemove,
})(PasswordReset)