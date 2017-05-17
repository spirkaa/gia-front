import React from 'react'
import PropTypes from 'prop-types'
import { Row, Glyphicon } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

const dateFormat = (cell, row) => new Date(row.date).toLocaleDateString('ru')

const placeFormat = (cell, row) => (
  <div><strong>№{cell.code}:</strong> {cell.name}<br />
    <a href={`https://yandex.ru/maps/?text=${cell.addr}`} target='_blank' title='Открыть карту'><Glyphicon glyph='map-marker' /> {cell.addr}</a>
  </div>
)

export const ExamTable = ({ exams }) => (
  <Row>
    <BootstrapTable data={exams} hover={true} condensed={true}>
      <TableHeaderColumn
        dataField='id'
        dataSort={true}
        isKey={true}
        hidden={true}
      >pk</TableHeaderColumn>
      <TableHeaderColumn
        dataField='date'
        dataSort={true}
        dataFormat={dateFormat}
        width='100'
        dataAlign='center'
      >Дата</TableHeaderColumn>
      <TableHeaderColumn
        dataField='level'
        dataSort={true}
        width='100'
        dataAlign='center'
      >Уровень</TableHeaderColumn>
      <TableHeaderColumn
        dataField='position'
        dataSort={true}
        width='230'
      >Должность</TableHeaderColumn>
      <TableHeaderColumn
        dataField='place'
        dataFormat={placeFormat}
      >ППЭ</TableHeaderColumn>
    </BootstrapTable>
  </Row>
)

ExamTable.propTypes = {
  exams: PropTypes.array.isRequired
}

export default ExamTable