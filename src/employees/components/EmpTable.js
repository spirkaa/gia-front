import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Row } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

export const EmpTable = ({ employees }) => (
  <Row>
    <BootstrapTable data={employees} hover={true} condensed={true}>
      <TableHeaderColumn
        dataField='id'
        dataSort={true}
        isKey={true}
        hidden={true}
      >pk</TableHeaderColumn>
      <TableHeaderColumn
        dataField='name'
        dataSort={true}
        dataFormat={ (cell, row) =>
          (<Link to={`/employees/detail/${row.id}`}>{row.name}</Link>) }
      >ФИО</TableHeaderColumn>
      <TableHeaderColumn
        dataField='org'
        dataFormat={ (cell, row) =>
          (<Link to={`/organisations/detail/${cell.id}`}>{cell.name}</Link>) }
      >Место работы</TableHeaderColumn>
    </BootstrapTable>
  </Row>
)

EmpTable.propTypes = {
  employees: PropTypes.array.isRequired
}

export default EmpTable