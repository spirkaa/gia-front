import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { modalShow, userInfo, userInfoUpdate, userInfoUpdateErrorsRemove, userLogout } from '../actions'
import SettingsPassword from './SettingsPassword'

class Settings extends Component {

  constructor (props) {
    super(props)
    this.state = {
      email: props.user.email,
      first_name: props.user.first_name,
      last_name: props.user.last_name,
    }
  }

  componentDidMount () {
    this.props.userInfo(this.props.token)
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.user, this.props.user)) {
      this.setState({
        first_name: nextProps.user.first_name,
        last_name: nextProps.user.last_name,
      })
    }
    if (!isEqual(nextProps.userInfoUpdateErrors, this.props.userInfoUpdateErrors)) {
      const message = nextProps.userInfoUpdateErrors
      if (message.non_field_errors) {
        message.non_field_errors.map(msg => toastr.error('Ошибка', msg))
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
  }

  componentWillUnmount () {
    this.props.userInfoUpdateErrorsRemove()
  }

  handleInputChange = (evt) => {
    const target = evt.target
    const value = target.value
    const name = target.name
    this.setState({ [name]: value })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    this.props.userInfoUpdate(
      this.props.token,
      this.props.user.username,
      this.state.first_name,
      this.state.last_name,
    )
  }

  render () {
    const { isInfoUpdateRequesting, modalShow } = this.props
    const header = 'Настройки'
    const subheader = 'Личная информация'
    return (
      <Row className='bottom-buffer'>
        <Header header={header} subHeader={subheader}/>
        <Col sm={4}>{''}</Col>
        <Col sm={4}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <ControlLabel>Электронная почта</ControlLabel>
              <FormControl.Static>
                {this.state.email}
              </FormControl.Static>
            </FormGroup>
            <FormGroup controlId='formFirstName'>
              <ControlLabel>Имя</ControlLabel>
              <FormControl
                type='text'
                name='first_name'
                placeholder='Укажите имя'
                value={this.state.first_name}
                onChange={this.handleInputChange}/>
            </FormGroup>
            <FormGroup controlId='formLastName'>
              <ControlLabel>Фамилия</ControlLabel>
              <FormControl
                type='text'
                name='last_name'
                placeholder='Укажите фамилию'
                value={this.state.last_name}
                onChange={this.handleInputChange}/>
            </FormGroup>
            <p>
              <Button
                block
                onClick={modalShow}>
                Изменить пароль
              </Button>
            </p>
            <Button
              type='submit'
              block
              bsStyle='primary'
              disabled={isInfoUpdateRequesting}>
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

Settings.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  isInfoUpdateRequesting: PropTypes.bool.isRequired,
  userInfoUpdateErrors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  user: state.auth.user,
  isInfoUpdateRequesting: state.auth.isInfoUpdateRequesting,
  userInfoUpdateErrors: state.auth.userInfoUpdateErrors,
})

export default connect(mapStateToProps, {
  modalShow,
  userLogout,
  userInfo,
  userInfoUpdate,
  userInfoUpdateErrorsRemove,
})(Settings)