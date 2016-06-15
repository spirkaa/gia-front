import React, { Component } from 'react'
import { Row } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

export default class ExamTable extends Component {
  render () {
    const { exams } = this.props
    return (
      <Row>
        <BootstrapTable data={exams} hover={true}>
          <TableHeaderColumn
            dataField='date'
            dataSort={true}
            isKey={true}
            width='110'>Дата экзамена</TableHeaderColumn>
          <TableHeaderColumn
            dataField='position'
            dataSort={true}
            width='220'>Должность в ППЭ</TableHeaderColumn>
          <TableHeaderColumn
            dataField='place'
            dataSort={true}>Наименование ППЭ</TableHeaderColumn>
          <TableHeaderColumn
            dataField='addr'
            dataSort={true}>Адрес ППЭ</TableHeaderColumn>
        </BootstrapTable>
      </Row>
    )
  }
}