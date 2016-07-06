import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { loadEmployees } from '../actions'
import { Header } from '../../main/components'
import { EmpTable } from '../components'
import Filter from './Filter'
import Pagination from './Pagination'

class Employees extends Component {
  componentDidMount () {
    this.props.loadEmployees()
  }

  render () {
    const header = 'Сотрудники, участвующие в ГИА 2016'
    const { employees, count } = this.props
    return (
      <Col lg={12}>
        <Header header={header} subHeader={count}/>
        <Filter />
        <EmpTable employees={employees}/>
        <Pagination />
      </Col>
    )
  }
}

Employees.propTypes = {
  employees: PropTypes.array.isRequired,
  count: PropTypes.number,
  loadEmployees: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    entities: { employee, empPage, organisation },
    pagination: { empActivePage }
  } = state
  const { count } = empPage[ 1 ] || { count: null }
  const currentPage = empPage[ empActivePage ] || { results: [] }
  const employeesOnPage = currentPage.results.map(id => employee[ id ])
  const employeesWithOrg = employeesOnPage.map(emp => ({ ...emp, org: organisation[ emp.org ] }))
  return ({
    employees: employeesWithOrg,
    count
  })
}

export default connect(mapStateToProps, {
  loadEmployees
})(Employees)
