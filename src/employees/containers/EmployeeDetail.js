import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { loadEmployeeDetail } from '../actions'
import Header from '../components/Header'
import ErrorMsg from '../components/Alerts'
import ExamTable from '../components/ExamTable'

export class EmployeeDetail extends Component {

  componentWillMount () {
    let employeeId = this.props.params[ 'employee_id' ]
    this.props.loadEmployeeDetail(employeeId)
  }

  render () {
    const { employee, error } = this.props

    if (error) {
      return (
        <ErrorMsg error={error}/>
      ) } else if (employee.name) {
        return (
          <Col lg={12}>
            <Header header={employee.name} subHeader={employee.org.name}/>
            <ExamTable exams={employee.exams}/>
          </Col>
        )
      }
    return (
      <Col lg={12} className='text-center'>
        Loading...
      </Col>
    )
  }
}

const mapStateToProps = (state) => {
  const { employee, error, loading } = state.data.activeEmployee
  return ({
    employee,
    error,
    loading
  })
}

export default connect(mapStateToProps, { loadEmployeeDetail })(EmployeeDetail)