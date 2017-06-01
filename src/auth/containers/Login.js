import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Checkbox, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { userLogin, userLoginErrorsRemove, userRememberMe } from '../actions'

class Login extends Component {

  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.state = {
      emailValid: null,
      passwordValid: null
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      emailValid: null,
      passwordValid: null
    })

    const message = nextProps.userLoginErrors
    if (message.non_field_errors) {
      toastr.error('Ошибка', message.non_field_errors[ 0 ])
    }
    if (message.email) {
      this.setState({ emailValid: 'error' })
    }
    if (message.password) {
      this.setState({ passwordValid: 'error' })
    }
  }

  componentWillUnmount () {
    this.props.userLoginErrorsRemove()
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.userLogin(
      findDOMNode(this.refs.email).value,
      findDOMNode(this.refs.password).value
    )
    const rememberCheckbox = findDOMNode(this.input).checked
    this.props.userRememberMe(rememberCheckbox)
  }

  render () {
    const header = 'Вход'
    const subheader = ' '

    const { email, password } = this.props.userLoginErrors
    const { emailValid, passwordValid } = this.state

    return (
      <Row className='bottom-buffer'>
        <Header header={header} subHeader={subheader}/>
        <Col sm={4}>{''}</Col>
        <Col sm={4}>
          <Form>
            <FormGroup controlId='formEmail' validationState={emailValid}>
              <ControlLabel>Электронная почта</ControlLabel>
              <FormControl
                type='email'
                ref='email'
                onKeyUp={this.handleKeyUp}/>
              {emailValid
                ? <HelpBlock>{email[ 0 ]}</HelpBlock>
                : null }
            </FormGroup>
            <FormGroup controlId='formPassword' validationState={passwordValid}>
              <ControlLabel>Пароль</ControlLabel>
              <FormControl
                type='password'
                ref='password'
                onKeyUp={this.handleKeyUp}/>
              {passwordValid
                ? <HelpBlock>{password[ 0 ]}</HelpBlock>
                : null }
            </FormGroup>
            <Checkbox inputRef={ref => { this.input = ref }}>
              Запомнить
            </Checkbox>
            <Button
              block
              bsStyle='primary'
              onClick={this.handleButtonClick}
              disabled={this.props.isAuthenticating}>
              Войти
            </Button>
          </Form>
          <hr/>
          <p>
            <Link to='/password-reset' onClick={this.close}>Забыли пароль?</Link>
          </p>
          <p>
            <Link to='/registration' onClick={this.close}>Регистрация</Link>
          </p>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticating: state.auth.isAuthenticating,
  userLoginErrors: state.auth.userLoginErrors
})

export default connect(mapStateToProps, {
  userLogin,
  userLoginErrorsRemove,
  userRememberMe
})(Login)