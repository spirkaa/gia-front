import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { Header } from '../../main/components'
import { loadEmployees } from '../actions'
import { employeesOnPageSelector, countSelector } from '../selectors'
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

const mapStateToProps = (state) => ({
  employees: employeesOnPageSelector(state),
  count: countSelector(state)
})

export default connect(mapStateToProps, {
  loadEmployees
})(Employees)
