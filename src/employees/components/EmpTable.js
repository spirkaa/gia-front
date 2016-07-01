import React, { PropTypes } from 'react'
import { Link } from 'react-router'
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
        width='320'
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