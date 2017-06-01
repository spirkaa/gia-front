import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { userRegistration, userRegistrationErrorsRemove } from '../actions'

class Registration extends Component {

  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.state = {
      emailValid: null,
      password1Valid: null,
      password2Valid: null
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      emailValid: null,
      password1Valid: null,
      password2Valid: null
    })

    const message = nextProps.userRegErrors
    if (message.non_field_errors) {
      toastr.error('Ошибка', message.non_field_errors[ 0 ])
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

  componentWillUnmount () {
    this.props.userRegistrationErrorsRemove()
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.userRegistration(
      findDOMNode(this.refs.email).value,
      findDOMNode(this.refs.password1).value,
      findDOMNode(this.refs.password2).value
    )
  }

  render () {
    const header = 'Регистрация'
    const subheader = 'Зарегистрируйтесь, чтобы подписаться на обновления в расписании'
    const { email, password1, password2 } = this.props.userRegErrors
    const { emailValid, password1Valid, password2Valid } = this.state
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
            <FormGroup controlId='formPassword1' validationState={password1Valid}>
              <ControlLabel>Пароль</ControlLabel>
              <FormControl
                type='password'
                ref='password1'
                onKeyUp={this.handleKeyUp}/>
              {password1Valid
                ? <HelpBlock>{password1[ 0 ]}</HelpBlock>
                : null }
            </FormGroup>
            <FormGroup controlId='formPassword2' validationState={password2Valid}>
              <ControlLabel>Повторите пароль</ControlLabel>
              <FormControl
                type='password'
                ref='password2'
                onKeyUp={this.handleKeyUp}/>
              {password2Valid
                ? <HelpBlock>{password2[ 0 ]}</HelpBlock>
                : null }
            </FormGroup>
            <Button
              block
              bsStyle='primary'
              onClick={this.handleButtonClick}
              disabled={this.props.isRegistering}>
              Зарегистрироваться
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  isRegistering: state.auth.isRegistering,
  userRegErrors: state.auth.userRegErrors
})

export default connect(mapStateToProps, {
  userRegistration,
  userRegistrationErrorsRemove
})(Registration)