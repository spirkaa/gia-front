import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Checkbox, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { authLogin, authLoginMsgRemove, authRememberMe } from '../actions'
import { EMAIL_REGEX } from '../utils'

function validate (email, password) {
  return {
    email: !EMAIL_REGEX.test(email),
    password: password.length === 0,
  }
}

class Login extends Component {

  constructor (props) {
    super(props)
    this.state = {
      emailValid: null,
      passwordValid: null,
      email: '',
      password: '',
      rememberMe: true,
      touched: {
        email: false,
        password: false,
      },
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      emailValid: null,
      passwordValid: null,
    })

    if (!isEqual(nextProps.authLoginMsg, this.props.authLoginMsg)) {
      const message = nextProps.authLoginMsg
      if (message.non_field_errors) {
        message.non_field_errors.map(msg => toastr.error('Ошибка', msg))
      }
      if (message.email) {
        this.setState({ emailValid: 'error' })
      }
      if (message.password) {
        this.setState({ passwordValid: 'error' })
      }
    }
  }

  componentWillUnmount () {
    this.props.authLoginMsgRemove()
  }

  canBeSubmitted () {
    const errors = validate(this.state.email, this.state.password)
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
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ [name]: value })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    if (!this.canBeSubmitted()) {
      return
    }
    const { email, password, rememberMe } = this.state
    this.props.authLogin(
      email,
      password,
    )
    this.props.authRememberMe(rememberMe)
  }

  render () {
    const header = 'Вход'
    const subheader = 'Введите данные учетной записи'

    const { email, password } = this.props.authLoginMsg
    const { emailValid, passwordValid } = this.state

    const errors = validate(this.state.email, this.state.password)
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
            <FormGroup controlId='formEmail'
                       validationState={shouldMarkError('email') || emailValid
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
              {shouldMarkError('email')
                ? <HelpBlock>Введите корректный адрес электронной почты.</HelpBlock>
                : null}
            </FormGroup>
            <FormGroup controlId='formPassword'
                       validationState={shouldMarkError('password') || passwordValid
                         ? 'error'
                         : null}>
              <ControlLabel>Пароль</ControlLabel>
              <FormControl
                type='password'
                name='password'
                value={this.state.password}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('password')}/>
              {passwordValid
                ? password.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
              {shouldMarkError('password')
                ? <HelpBlock>Пароль не может быть пустым.</HelpBlock>
                : null}
            </FormGroup>
            <Checkbox
              name='rememberMe'
              checked={this.state.rememberMe}
              onChange={this.handleInputChange}>
              Запомнить
            </Checkbox>
            <Button
              type='submit'
              block
              bsStyle='primary'
              disabled={this.props.isAuthenticating || isDisabled}>
              Войти
            </Button>
          </Form>
          <hr/>
          <p>
            <Link to='/password-reset'>Забыли пароль?</Link>
          </p>
          <p>
            <Link to='/registration'>Регистрация</Link>
          </p>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

Login.propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  authLoginMsg: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  isAuthenticating: state.auth.isAuthenticating,
  authLoginMsg: state.auth.authLoginMsg,
})

export default connect(mapStateToProps, {
  authLogin,
  authLoginMsgRemove,
  authRememberMe,
})(Login)