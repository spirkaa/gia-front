import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Row } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Spinner from 'react-spinkit'
import Loader from 'react-loader-advanced'

const dateFormat = (cell, row) => new Date(row.date).toLocaleDateString('ru')

const placeFormat = (cell, row) => (
  <div>
    №{cell.code}: {cell.name}<br />
    <a href={`https://yandex.ru/maps/?text=${cell.addr}`} target='_blank' title='Открыть карту'>
      <small>{cell.addr}</small>
    </a>
  </div>
)

const employeeFormat = (cell, row) => (
  <div>
    <Link to={`/employees/detail/${cell.id}`}>{cell.name}</Link><br />
    <Link to={`/organisations/detail/${cell.org.id}`}>
      <small>{cell.org.name}</small>
    </Link>
  </div>
)

export const ExamsTable = ({ exams }) => {
  const loading = !exams.length > 0
  const spinner = <Spinner spinnerName='double-bounce' noFadeIn/>
  return (
    <Row>
      <Loader show={loading}
              message={spinner}
              contentBlur={1}
              backgroundStyle={{ backgroundColor: 'rgba(255,255,255,0.75)' }}>
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
      </Loader>
    </Row>
  )
}

ExamsTable.propTypes = {
  exams: PropTypes.array.isRequired
}

export default ExamsTable