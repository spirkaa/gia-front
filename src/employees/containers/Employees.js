import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { loadEmployees } from '../actions'
import Header from '../components/Header'
import ErrorMsg from '../components/Alerts'
import Pagination from '../components/Pagination'
import Filter from '../components/Filter'
import EmployeesTable from '../components/EmpTable'

export class Employees extends Component {

  handleNextPageClick () {
    this.props.loadEmployees(this.props.employees.next, true)
  }

  handlePrevPageClick () {
    this.props.loadEmployees(this.props.employees.previous, true)
  }

  componentDidMount () {
    this.props.loadEmployees('employee/')
  }

  render () {
    const header = 'Сотрудники, участвующие в ГИА 2016'
    const { employees, error, loading } = this.props
    const prev = employees.previous

    if (error) {
      return (
        <ErrorMsg error={error}/>
      )
    } else if (employees.count) {
      return (
        <Col lg={12}>
          <Header header={header} subHeader={employees.count}/>
          <Filter />
          <EmployeesTable employees={employees.results}/>
          <Pagination onPrevPageClick={::this.handlePrevPageClick}
                      onNextPageClick={::this.handleNextPageClick}
                      prev={prev}
                      loading={loading}/>
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
  const { employees, error, loading } = state.data.employeesList
  return ({
    employees,
    error,
    loading
  })
}

export default connect(mapStateToProps, { loadEmployees })(Employees)
