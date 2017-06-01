import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, Form, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { userRegMailVerifyErrorsRemove, userRegVerifyMail } from '../actions'

class RegistrationEmailConfirm extends Component {

  constructor (props) {
    super(props)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {

    const message = nextProps.userRegVerifyMailErrors
    if (message.non_field_errors) {
      toastr.error('Ошибка', message.non_field_errors[ 0 ])
    }
    if (message.key) {
      toastr.error('Ошибка', message.key[ 0 ])
    }
    if (message.detail) {
      toastr.success('', 'Почтовый адрес подтвержден')
      this.props.history.push('/')
    }
  }

  componentWillUnmount () {
    this.props.userRegMailVerifyErrorsRemove()
  }

  handleButtonClick () {
    const { key } = this.props.match.params
    this.props.userRegVerifyMail(
      key,
    )
  }

  render () {
    const header = 'Подтверждение почтового адреса'
    const subheader = ' '
    return (
      <Row className='bottom-buffer'>
        <Header header={header} subHeader={subheader}/>
        <Col sm={4}>{''}</Col>
        <Col sm={4}>
          <Form>
            <Button
              block
              bsStyle='primary'
              onClick={this.handleButtonClick}
              disabled={this.props.isMailVerifying}>
              Подтвердить email
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  isMailVerifying: state.auth.isMailVerifying,
  userRegVerifyMailErrors: state.auth.userRegVerifyMailErrors,
})

export default connect(mapStateToProps, {
  userRegVerifyMail,
  userRegMailVerifyErrorsRemove,
})(RegistrationEmailConfirm)