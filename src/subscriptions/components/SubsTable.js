import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { ExamTable } from '../../employees/components'

export class SubsTable extends Component {

  constructor (props) {
    super(props)
    this.onRowDelete = this.onRowDelete.bind(this)
  }

  onRowDelete (rowKeys) {
    const { onDelete, token } = this.props
    rowKeys.map(key => onDelete(token, key))
  }

  expandComponent (row) {
    return (
      <ExamTable exams={row.employee.exams}/>
    )
  }

  isExpandableRow () {
    return true
  }

  render () {
    const options = {
      afterDeleteRow: this.onRowDelete,
      deleteText: 'Отписаться',
      expandRowBgColor: 'rgb(242, 255, 163)'
    }

    const selectRowProp = {
      mode: 'checkbox',
      clickToExpand: true
    }
    return (
      <div>
        <BootstrapTable
          data={this.props.subscriptions}
          hover={true}
          condensed={true}
          deleteRow={true}
          selectRow={selectRowProp}
          options={options}
          expandableRow={this.isExpandableRow}
          expandComponent={this.expandComponent}
          expandColumnOptions={ { expandColumnVisible: true, expandColumnBeforeSelectColumn: false } }
          >
        <TableHeaderColumn
            dataField='id'
            dataSort={true}
            isKey={true}
            hidden={true}
          >pk</TableHeaderColumn>
          <TableHeaderColumn
            dataField='employee'
            dataSort={true}
            dataFormat={ (cell, row) =>
              (<Link to={`/employees/detail/${cell.id}`}>{cell.name}</Link>) }
          >ФИО</TableHeaderColumn>
          <TableHeaderColumn
            dataField='employee'
            dataFormat={ (cell, row) =>
              (<Link to={`/organisations/detail/${cell.org.id}`}>{cell.org.name}</Link>) }
          >Место работы</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

SubsTable.propTypes = {
  token: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  subscriptions: PropTypes.array.isRequired,
}

export default SubsTable