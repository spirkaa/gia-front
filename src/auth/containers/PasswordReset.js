import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { userPasswordReset, userPasswordResetErrorsRemove } from '../actions'

class PasswordReset extends Component {

  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.state = {
      emailValid: null
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      emailValid: null,
    })

    const message = nextProps.userPasswordResetErrors
    if (message.non_field_errors) {
      toastr.error('Ошибка', message.non_field_errors[ 0 ])
    }
    if (message.email) {
      this.setState({ emailValid: 'error' })
    }
    if (message.detail) {
      toastr.success('', message.detail)
      this.props.history.push('/password-reset/email-sent')
    }
  }

  componentWillUnmount () {
    this.props.userPasswordResetErrorsRemove()
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.userPasswordReset(
      findDOMNode(this.refs.email).value
    )
    // findDOMNode(this.refs.email).value = ''
  }

  render () {
    const header = 'Восстановление пароля'
    const subheader = 'Введите email, указанный при регистрации'

    const { email } = this.props.userPasswordResetErrors
    const { emailValid } = this.state
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
            <Button
              block
              bsStyle='primary'
              onClick={this.handleButtonClick}
              disabled={this.props.isPasswordMailSending}>
              Восстановить пароль
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  isPasswordMailSending: state.auth.isPasswordMailSending,
  userPasswordResetErrors: state.auth.userPasswordResetErrors
})

export default connect(mapStateToProps, {
  userPasswordReset,
  userPasswordResetErrorsRemove
})(PasswordReset)