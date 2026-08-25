import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import BootstrapTable from "react-bootstrap-table-ng"

const columns = [
  {
    dataField: "id",
    text: "pk",
    hidden: true,
  },
  {
    dataField: "org",
    text: "Образовательная организация",
    formatter: (cell, row) => (
      <Link to={`/organisations/detail/${row.id}`}>{row.name}</Link>
    ),
  },
]

export const OrgTable = ({ organisations }) => (
  <BootstrapTable
    keyField="id"
    bootstrap5={true}
    columns={columns}
    data={organisations}
    hover={true}
    condensed={true}></BootstrapTable>
)

OrgTable.propTypes = {
  organisations: PropTypes.array.isRequired,
}

export default OrgTable
