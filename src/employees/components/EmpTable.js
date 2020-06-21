import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
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
    headerStyle: (column, colIndex) => {
      return { width: "35%" }
    },
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
  <BootstrapTable
    keyField="id"
    columns={columns}
    data={employees}
    hover={true}
    condensed={true}></BootstrapTable>
)

EmpTable.propTypes = {
  employees: PropTypes.array.isRequired,
}

export default EmpTable
