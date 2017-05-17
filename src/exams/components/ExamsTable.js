import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Row, Glyphicon } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

const dateFormat = (cell, row) => new Date(row.date).toLocaleDateString('ru')

const placeFormat = (cell, row) => (
  <div>
    №{cell.code}: {cell.name}<br />
    <a href={`https://yandex.ru/maps/?text=${cell.addr}`} target='_blank' title='Открыть карту'><small><Glyphicon glyph='map-marker' /> {cell.addr}</small></a>
  </div>
)

const employeeFormat = (cell, row) => (
  <div>
    <Link to={`/employees/detail/${cell.id}`}>{cell.name}</Link><br />
    <Link to={`/organisations/detail/${cell.org.id}`}><small>{cell.org.name}</small></Link>
  </div>
)

export const ExamsTable = ({ exams }) => (
  <Row>
    <BootstrapTable data={exams} hover={true} condensed={true}>
      <TableHeaderColumn
        dataField='id'
        isKey={true}
        hidden={true}
      >pk</TableHeaderColumn>
      <TableHeaderColumn
        dataField='date'
        dataFormat={dateFormat}
        width='80'
      >Дата</TableHeaderColumn>
      <TableHeaderColumn
        dataField='level'
        width='80'
      >Уровень</TableHeaderColumn>
      <TableHeaderColumn
        dataField='employee'
        dataFormat={employeeFormat}
      >Сотрудник</TableHeaderColumn>
      <TableHeaderColumn
        dataField='position'
        width='230'
      >Должность</TableHeaderColumn>
       <TableHeaderColumn
        dataField='place'
        dataFormat={placeFormat}
      >ППЭ</TableHeaderColumn>
    </BootstrapTable>
  </Row>
)

ExamsTable.propTypes = {
  exams: PropTypes.array.isRequired
}

export default ExamsTable