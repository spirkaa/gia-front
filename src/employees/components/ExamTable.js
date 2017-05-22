import React from 'react'
import PropTypes from 'prop-types'
import { Row, Glyphicon } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

const dateFormat = (cell, row) => new Date(row.date).toLocaleDateString('ru')

const placeFormat = (cell, row) => (
  <div>
    №{cell.code}: {cell.name}<br />
    <a href={`https://yandex.ru/maps/?text=${cell.addr}`} target='_blank' title='Открыть карту'><small><Glyphicon glyph='map-marker' /> {cell.addr}</small></a>
  </div>
)

export const ExamTable = ({ exams }) => (
  <Row>
    <BootstrapTable data={exams} hover={true} condensed={true} tableContainerClass='no-more-tables'>
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
        tdAttr={{'data-title': 'Дата'}}
      >Дата</TableHeaderColumn>
      <TableHeaderColumn
        dataField='level'
        dataSort={true}
        width='100'
        dataAlign='center'
        tdAttr={{'data-title': 'Уровень'}}
      >Уровень</TableHeaderColumn>
      <TableHeaderColumn
        dataField='position'
        dataSort={true}
        width='230'
        tdAttr={{'data-title': 'Должность'}}
      >Должность</TableHeaderColumn>
      <TableHeaderColumn
        dataField='place'
        dataFormat={placeFormat}
        tdAttr={{'data-title': 'ППЭ'}}
      >ППЭ</TableHeaderColumn>
    </BootstrapTable>
  </Row>
)

ExamTable.propTypes = {
  exams: PropTypes.array.isRequired
}

export default ExamTable