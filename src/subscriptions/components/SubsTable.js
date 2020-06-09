import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Button, Form, Glyphicon } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"

import { ExamTable } from "../../employees/components"

export class SubsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowKeys: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    const { onDelete, token } = this.props
    this.state.rowKeys.map((key) => onDelete(token, key))
  }

  onSelect(row, isSelect, rowIndex, e) {
    if (isSelect) {
      this.setState({
        rowKeys: [...this.state.rowKeys, row.id],
      })
    } else {
      this.setState({
        rowKeys: this.state.rowKeys.filter((itemId) => itemId !== row.id),
      })
    }
  }

  onSelectAll(isSelect, rows, e) {
    if (isSelect) {
      this.setState({
        rowKeys: rows.map((row) => row.id),
      })
    } else {
      this.setState({
        rowKeys: [],
      })
    }
  }

  render() {
    const selectRow = {
      mode: "checkbox",
      clickToExpand: true,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    }

    const expandRow = {
      renderer: (row, rowIndex) => <ExamTable exams={row.employee.exams} />,
      showExpandColumn: true,
    }

    const columns = [
      {
        dataField: "id",
        text: "pk",
        hidden: true,
      },
      {
        dataField: "employee",
        text: "ФИО",
        formatter: (cell, row) => (
          <Link to={`/employees/detail/${cell.id}`}>{cell.name}</Link>
        ),
      },
      {
        dataField: "employee.org",
        text: "Место работы",
        formatter: (cell, row) => (
          <Link to={`/organisations/detail/${cell.id}`}>{cell.name}</Link>
        ),
      },
    ]

    return (
      <div>
        <Form className="bottom-buffer-5px" onSubmit={this.handleSubmit}>
          <Button bsStyle="warning" type="submit" disabled={!this.state.rowKeys.length}>
            <Glyphicon glyph="trash" /> Отменить подписку
          </Button>
        </Form>
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={this.props.subscriptions}
          hover={true}
          condensed={true}
          selectRow={selectRow}
          expandRow={expandRow}></BootstrapTable>
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
