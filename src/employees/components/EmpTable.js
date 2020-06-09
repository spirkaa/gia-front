import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Row } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"

const columns = [
  {
    dataField: "id",
    text: "pk",
    hidden: true,
  },
  {
    dataField: "name",
    text: "ФИО",
    formatter: (cell, row) => (
      <Link to={`/employees/detail/${row.id}`}>{row.name}</Link>
    ),
  },
  {
    dataField: "org",
    text: "Место работы",
    formatter: (cell, row) => (
      <Link to={`/organisations/detail/${cell.id}`}>{cell.name}</Link>
    ),
  },
]

export const EmpTable = ({ employees }) => (
  <Row>
    <BootstrapTable
      keyField="id"
      columns={columns}
      data={employees}
      hover={true}
      condensed={true}></BootstrapTable>
  </Row>
)

EmpTable.propTypes = {
  employees: PropTypes.array.isRequired,
}

export default EmpTable
