import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Button, Col, Form, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { userRegMailVerifyErrorsRemove, userRegVerifyMail } from '../actions'

class RegistrationEmailConfirm extends Component {

  componentWillReceiveProps (nextProps) {

    if (!isEqual(nextProps.userRegVerifyMailErrors, this.props.userRegVerifyMailErrors)) {
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
  }

  componentWillUnmount () {
    this.props.userRegMailVerifyErrorsRemove()
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    this.props.userRegVerifyMail(
      this.props.match.params.key,
    )
  }

  render () {
    const header = 'Подтверждение почтового адреса'
    const subheader = 'Нажмите на кнопку'
    return (
      <Row className='bottom-buffer'>
        <Header header={header} subHeader={subheader}/>
        <Col sm={4}>{''}</Col>
        <Col sm={4}>
          <Form onSubmit={this.handleSubmit}>
            <Button
              type='submit'
              block
              bsStyle='primary'
              disabled={this.props.isMailVerifying}>
              Подтвердить адрес
            </Button>
          </Form>
        </Col>
        <Col sm={4}>{''}</Col>
      </Row>
    )
  }
}

RegistrationEmailConfirm.propTypes = {
  isMailVerifying: PropTypes.bool.isRequired,
  userRegVerifyMailErrors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  isMailVerifying: state.auth.isMailVerifying,
  userRegVerifyMailErrors: state.auth.userRegVerifyMailErrors,
})

export default connect(mapStateToProps, {
  userRegVerifyMail,
  userRegMailVerifyErrorsRemove,
})(RegistrationEmailConfirm)