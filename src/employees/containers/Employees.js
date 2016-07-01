import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { loadEmployees } from '../actions'
import { Header } from '../../main/components'
import { EmpTable } from '../components'
import FilterContainer from './FilterContainer'
import PaginationContainer from './PaginationContainer'

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
        <FilterContainer />
        <EmpTable employees={employees}/>
        <PaginationContainer />
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
    entities: { employee, page, organisation },
    activePage
  } = state
  const { count } = page[ 1 ] || { count: null }
  const currentPage = page[ activePage ] || { results: [] }
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
