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
        filter={ {type: 'TextFilter', placeholder: 'Фильтр...'} }
        dataFormat={ (cell, row) =>
          (<Link to={`/employees/detail/${row.id}`}>{row.name}</Link>) }
      >ФИО</TableHeaderColumn>
      <TableHeaderColumn
        dataField='num_exams'
        dataSort={true}
      >Рабочих дней</TableHeaderColumn>
    </BootstrapTable>
  </Row>
)

EmpTable.propTypes = {
  employees: PropTypes.array.isRequired
}

export default EmpTable