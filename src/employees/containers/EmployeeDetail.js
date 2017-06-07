import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Button, Col, Form, Row } from 'react-bootstrap'

import { Header } from '../../main/components'
import { subsAdd } from '../../subscriptions/actions'
import { loadEmployeeDetail } from '../actions'
import { employeeDetailSelector } from '../selectors'
import { ExamTable } from '../components'

class EmployeeDetail extends Component {
  componentDidMount () {
    const { employeeId } = this.props.match.params
    this.props.loadEmployeeDetail(employeeId)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isSubAddRequested) {
      this.props.history.push('/subscriptions')
    }
        if (!isEqual(nextProps.subsMsg, this.props.subsMsg)) {
      const message = nextProps.subsMsg
      if (message.non_field_errors) {
        message.non_field_errors.map(msg => toastr.error('Ошибка', msg))
      }
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    if (this.props.token) {
      this.props.subsAdd(
        this.props.token,
        this.props.match.params.employeeId,
      )
    } else {
      this.props.history.push('/registration')
    }
  }

  render () {
    const { employee, isSubAddRequesting } = this.props
    if (employee.name && employee.exams) {
      const org = <Link to={`/organisations/detail/${employee.org.id}`}>{employee.org.name}</Link>
      return (
        <Row className='bottom-buffer'>
          <Header header={employee.name} subHeader={org}/>
          <Col sm={4}>{''}</Col>
          <Col sm={4} className='bottom-buffer'>
            <Form onSubmit={this.handleSubmit}>
              <Button
                block
                type='submit'
                bsStyle='primary'
                disabled={isSubAddRequesting}>
                {isSubAddRequesting
                  ? 'Пожалуйста, подождите...'
                  : 'Подписаться на обновления'}
              </Button>
            </Form>
          </Col>
          <Col sm={4}>{''}</Col>
          <Col sm={12}>
            <ExamTable exams={employee.exams}/>
          </Col>
        </Row>
      )
    }
    return (
      <Col lg={12} className='text-center'>
        Loading...
      </Col>
    )
  }
}

EmployeeDetail.propTypes = {
  employee: PropTypes.object.isRequired,
  loadEmployeeDetail: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  employee: employeeDetailSelector(state, ownProps),
  token: state.auth.token,
  subsMsg: state.subs.subsMsg,
  isSubAddRequesting: state.subs.isSubAddRequesting,
  isSubAddRequested: state.subs.isSubAddRequested,
})

export default connect(mapStateToProps, {
  loadEmployeeDetail,
  subsAdd,
})(EmployeeDetail)