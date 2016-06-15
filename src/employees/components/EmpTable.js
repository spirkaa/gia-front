import React, { Component } from 'react'
import { Link } from 'react-router'
import { Row } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

export default class EmpTable extends Component {
  render () {
    const { employees } = this.props
    return (
      <Row>
        <BootstrapTable data={employees} hover={true}>
          <TableHeaderColumn
            dataField='id'
            dataSort={true}
            isKey={true}
            width='100'
            hidden={true}>pk</TableHeaderColumn>
          <TableHeaderColumn
            dataField='name'
            dataSort={true}
            dataFormat={ (cell, row) =>
                (<Link to={`/employees/${row.id}`}>{row.name}</Link>) }
            width='250'>ФИО</TableHeaderColumn>
          <TableHeaderColumn
            dataField='org'
            dataSort={true}>Место работы</TableHeaderColumn>
        </BootstrapTable>
      </Row>
    )
  }
}