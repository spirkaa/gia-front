import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { authRegistration, authRegistrationMsgRemove } from '../actions'
import { EMAIL_REGEX } from '../utils'

function validate (email, password1, password2) {
  return {
    email: !EMAIL_REGEX.test(email),
    password1: password1.length === 0,
    password2: password2.length === 0,
  }
}

class Registration extends Component {

  constructor (props) {
    super(props)
    this.state = {
      emailValid: null,
      password1Valid: null,
      password2Valid: null,
      email: '',
      password1: '',
      password2: '',
      touched: {
        email: false,
        password1: false,
        password2: false,
      },
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      emailValid: null,
      password1Valid: null,
      password2Valid: null,
    })
    if (!isEqual(nextProps.authRegMsg, this.props.authRegMsg)) {
      const message = nextProps.authRegMsg
      if (message.non_field_errors) {
        message.non_field_errors.map(msg => toastr.error('Ошибка', msg))
      }
      if (message.email) {
        this.setState({ emailValid: 'error' })
      }
      if (message.password1) {
        this.setState({ password1Valid: 'error' })
      }
      if (message.password2) {
        this.setState({ password2Valid: 'error' })
      }
    }
  }

  componentWillUnmount () {
    this.props.authRegistrationMsgRemove()
  }

  canBeSubmitted () {
    const errors = validate(this.state.email, this.state.password1, this.state.password2)
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
    const { email, password1, password2 } = this.state
    this.props.authRegistration(
      email,
      password1,
      password2,
    )
  }

  render () {
    const header = 'Регистрация'
    const subheader = 'Зарегистрируйтесь, чтобы подписаться на обновления в расписании'

    const { email, password1, password2 } = this.props.authRegMsg
    const { emailValid, password1Valid, password2Valid } = this.state

    const errors = validate(this.state.email, this.state.password1, this.state.password2)
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
            <FormGroup controlId='formPassword1'
                       validationState={shouldMarkError('password1') || password1Valid
                         ? 'error'
                         : null}>
              <ControlLabel>Пароль</ControlLabel>
              <FormControl
                type='password'
                name='password1'
                value={this.state.password1}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('password1')}/>
              {password1Valid
                ? password1.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
            </FormGroup>
            <FormGroup controlId='formPassword2'
                       validationState={shouldMarkError('password2') || password2Valid
                         ? 'error'
                         : null}>
              <ControlLabel>Повторите пароль</ControlLabel>
              <FormControl
                type='password'
                name='password2'
                value={this.state.password2}
                onChange={this.handleInputChange}
                onBlur={this.handleBlur('password2')}/>
              {password2Valid
                ? password2.map(msg => <HelpBlock>{msg}</HelpBlock>)
                : null }
            </FormGroup>
            <Button
              type='submit'
              block
              bsStyle='primary'
              disabled={this.props.isRegistering || isDisabled}>
              { this.props.isRegistering
                ? 'Пожалуйста, подождите...'
                : 'Зарегистрироваться'}
            </Button>
          </Form>
          <hr/>
          <p>
            Уже есть учетная запись? <Link to='/login'>Войти</Link>
          </p>
        </Col>
        <Col sm={4}>{''}</Col>
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