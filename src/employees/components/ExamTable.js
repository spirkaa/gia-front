import React from 'react'
import PropTypes from 'prop-types'
import { Glyphicon } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

const dateFormat = (cell, row) => new Date(row.date).toLocaleDateString('ru')

const placeFormat = (cell, row) => (
  <div>
    №{cell.code}: {cell.name}<br />
    <a href={`https://yandex.ru/maps/?text=${cell.addr}`} target='_blank' rel='noopener noreferrer'
       title='Открыть карту'>
      <small><Glyphicon glyph='map-marker'/> {cell.addr}</small>
    </a>
  </div>
)

export const ExamTable = ({ exams }) => (
  <BootstrapTable data={exams} hover={true} condensed={true} tableContainerClass='no-more-tables'>
    <TableHeaderColumn
      dataField='id'
      isKey={true}
      hidden={true}
    >pk</TableHeaderColumn>
    <TableHeaderColumn
      dataField='date'
      dataFormat={dateFormat}
      width='7%'
      tdAttr={{ 'data-title': 'Дата' }}
    >Дата</TableHeaderColumn>
    <TableHeaderColumn
      dataField='level'
      width='5%'
      tdAttr={{ 'data-title': 'Уровень' }}
    >Уровень</TableHeaderColumn>
    <TableHeaderColumn
      dataField='position'
      width='18%'
      tdAttr={{ 'data-title': 'Должность' }}
    >Должность</TableHeaderColumn>
    <TableHeaderColumn
      dataField='place'
      dataFormat={placeFormat}
      width='39%'
      tdAttr={{ 'data-title': 'ППЭ' }}
    >ППЭ</TableHeaderColumn>
  </BootstrapTable>
)

ExamTable.propTypes = {
  exams: PropTypes.array.isRequired,
}

export default ExamTable