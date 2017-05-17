import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Row } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

export const OrgTable = ({ organisations }) => (
  <Row>
    <BootstrapTable data={organisations} hover={true} condensed={true}>
      <TableHeaderColumn
        dataField='id'
        dataSort={true}
        isKey={true}
        hidden={true}
      >pk</TableHeaderColumn>
      <TableHeaderColumn
        dataField='org'
        dataFormat={ (cell, row) =>
          (<Link to={`/organisations/detail/${row.id}`}>{row.name}</Link>) }
      >Образовательная организация</TableHeaderColumn>
    </BootstrapTable>
  </Row>
)

OrgTable.propTypes = {
  organisations: PropTypes.array.isRequired
}

export default OrgTable