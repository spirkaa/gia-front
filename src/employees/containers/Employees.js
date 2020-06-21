import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Col, Row } from "react-bootstrap"
import { Header } from "../../main/components"
import { loadEmployees } from "../actions"
import { employeesOnPageSelector, countSelector } from "../selectors"
import { EmpTable } from "../components"
import Filter from "./Filter"
import Pagination from "./Pagination"

class Employees extends Component {
  componentDidMount() {
    this.props.loadEmployees()
  }

  render() {
    const header = "Сотрудники, участвующие в ГИА"
    const { employees, count } = this.props
    return (
      <div>
        <Header header={header} subHeader={count} />
        <Filter />
        <Row>
          <Col lg={1}></Col>
          <Col lg={10}>
            <EmpTable employees={employees} />
            <Pagination />
          </Col>
          <Col lg={1}></Col>
        </Row>
      </div>
    )
  }
}

Employees.propTypes = {
  employees: PropTypes.array.isRequired,
  count: PropTypes.number,
  loadEmployees: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  employees: employeesOnPageSelector(state),
  count: countSelector(state),
})

export default connect(mapStateToProps, {
  loadEmployees,
})(Employees)
