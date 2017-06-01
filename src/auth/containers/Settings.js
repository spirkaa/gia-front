import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { modalShow, userInfo, userInfoUpdate, userInfoUpdateErrorsRemove, userLogout } from '../actions'
import SettingsPassword from './SettingsPassword'

class Settings extends Component {

  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount () {
    this.props.userInfo(this.props.token)
  }

  componentWillReceiveProps (nextProps) {
    findDOMNode(this.refs.firstName).value = nextProps.user.first_name
    findDOMNode(this.refs.lastName).value = nextProps.user.last_name

    const message = nextProps.userInfoUpdateErrors
    if (message.non_field_errors) {
      toastr.error('Ошибка', message.non_field_errors[ 0 ])
    }
    if (message.detail) {
      if (message.detail === 'Signature has expired.') {
        toastr.error('Сессия истекла', 'Требуется повторный вход')
        this.props.userLogout()
      }
      else {
        toastr.success('', message.detail)
      }
    }
  }

  componentWillUnmount () {
    this.props.userInfoUpdateErrorsRemove()
  }

  handleChange(e) {
    this.setState({value: e.target.value})
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.userInfoUpdate(
      this.props.token,
      this.props.user.username,
      findDOMNode(this.refs.firstName).value,
      findDOMNode(this.refs.lastName).value
    )
  }

  render () {
    const { user, modalShow } = this.props
    const header = 'Настройки'
    const subheader = ' '
    return (
      <Row className='bottom-buffer'>
        <Header header={header} subHeader={subheader}/>
        <Col sm={4}>{''}</Col>
        <Col sm={4}>
          <Form>
            <FormGroup>
              <ControlLabel>Электронная почта</ControlLabel>
              <FormControl.Static>
                {user.email}
              </FormControl.Static>
            </FormGroup>
            <FormGroup controlId='formFirstName'>
              <ControlLabel>Имя</ControlLabel>
              <FormControl
                type='text'
                ref='firstName'
                name='firstName'
                placeholder='Укажите имя'
                defaultValue={user.first_name}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>
            <FormGroup controlId='formLastName'>
              <ControlLabel>Фамилия</ControlLabel>
              <FormControl
                type='text'
                ref='lastName'
                name='lastName'
                placeholder='Укажите фамилию'
                defaultValue={user.last_name}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>
            <p>
              <Button
                block
                onClick={modalShow}>
                Изменить пароль
              </Button>
            </p>
            <Button
              block
              bsStyle='primary'
              onClick={this.handleButtonClick}
              disabled={this.props.isInfoUpdateRequesting}>
              Сохранить
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{''}</Col>
        <SettingsPassword/>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  user: state.auth.user,
  isInfoUpdateRequesting: state.auth.isInfoUpdateRequesting,
  userInfoUpdateErrors: state.auth.userInfoUpdateErrors
})

export default connect(mapStateToProps, {
  modalShow,
  userLogout,
  userInfo,
  userInfoUpdate,
  userInfoUpdateErrorsRemove
})(Settings)