import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { userPasswordResetConfirm, userPasswordResetConfirmErrorsRemove } from '../actions'

class PasswordResetConfirm extends Component {

  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.state = {
      newPassword1Valid: null,
      newPassword2Valid: null
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      newPassword1Valid: null,
      newPassword2Valid: null
    })

    const message = nextProps.userPasswordResetConfirmErrors
    if (message.non_field_errors) {
      toastr.error('Ошибка', message.non_field_errors[ 0 ])
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

  componentWillUnmount () {
    this.props.userPasswordResetConfirmErrorsRemove()
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    const { uid, token } = this.props.match.params
    this.props.userPasswordResetConfirm(
      uid,
      token,
      findDOMNode(this.refs.newPassword1).value,
      findDOMNode(this.refs.newPassword2).value
    )
  }

  render () {
    const header = 'Восстановление пароля'
    const subheader = 'Укажите новый пароль'
    const { new_password1, new_password2 } = this.props.userPasswordResetConfirmErrors
    const { newPassword1Valid, newPassword2Valid } = this.state
    return (
      <Row className='bottom-buffer'>
        <Header header={header} subHeader={subheader}/>
        <Col sm={4}>{''}</Col>
        <Col sm={4}>
          <Form>
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
              disabled={this.props.isPasswordResetConfirming}>
              Отправить
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  isPasswordResetConfirming: state.auth.isPasswordResetConfirming,
  userPasswordResetConfirmErrors: state.auth.userPasswordResetConfirmErrors
})

export default connect(mapStateToProps, {
  userPasswordResetConfirm,
  userPasswordResetConfirmErrorsRemove
})(PasswordResetConfirm)