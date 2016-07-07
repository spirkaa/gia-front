import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { Row } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

const placeFormat = (cell, row) => (
  <div>
    №{row.code}: {row.name}<br />
    <a href={`https://yandex.ru/maps/?text=${row.addr}`} target='_blank' title='Открыть карту'><small>{row.addr}</small></a>
  </div>
)

const ateFormat = (cell, row) => (
  <div>{cell.code}, {cell.name}</div>
)

export const PlacesTable = ({ places }) => (
  <Row>
    <BootstrapTable data={places} hover={true} condensed={true}>
      <TableHeaderColumn
        dataField='id'
        dataSort={true}
        isKey={true}
        hidden={true}
      >pk</TableHeaderColumn>
      <TableHeaderColumn
        dataField='name'
        dataFormat={placeFormat}
      >Код, наименование, адрес ППЭ</TableHeaderColumn>
      <TableHeaderColumn
        dataField='ate'
        width='400'
        dataFormat={ateFormat}
      >Код, наименование АТЕ</TableHeaderColumn>
    </BootstrapTable>
  </Row>
)

PlacesTable.propTypes = {
  places: PropTypes.array.isRequired
}

export default PlacesTable