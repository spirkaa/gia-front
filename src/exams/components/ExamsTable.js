import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Row, Glyphicon } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"

const placeFormat = (cell, row) => (
  <div>
    №{cell.code}: {cell.name}
    <br />
    <a
      href={`https://yandex.ru/maps/?text=${cell.addr}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Открыть карту">
      <small>
        <Glyphicon glyph="map-marker" /> {cell.addr}
      </small>
    </a>
  </div>
)

const employeeFormat = (cell, row) => (
  <div>
    <Link to={`/employees/detail/${cell.id}`}>{cell.name}</Link>
    <br />
    <Link to={`/organisations/detail/${cell.org.id}`}>
      <small>{cell.org.name}</small>
    </Link>
  </div>
)

const columns = [
  {
    dataField: "id",
    text: "pk",
    hidden: true,
  },
  {
    dataField: "date",
    text: "Дата",
    attrs: { "data-title": "Дата" },
    formatter: (cell, row) => new Date(row.date).toLocaleDateString("ru"),
    headerStyle: (column, colIndex) => {
      return { width: "7%" }
    },
  },
  {
    dataField: "level",
    text: "Уровень",
    attrs: { "data-title": "Уровень" },
    headerStyle: (column, colIndex) => {
      return { width: "5%" }
    },
  },
  {
    dataField: "employee",
    text: "Сотрудник",
    formatter: employeeFormat,
    attrs: { "data-title": "Сотрудник" },
    headerStyle: (column, colIndex) => {
      return { width: "30%" }
    },
  },
  {
    dataField: "position",
    text: "Должность",
    attrs: { "data-title": "Должность" },
    headerStyle: (column, colIndex) => {
      return { width: "17%" }
    },
  },
  {
    dataField: "place",
    text: "ППЭ",
    formatter: placeFormat,
    attrs: { "data-title": "ППЭ" },
    headerStyle: (column, colIndex) => {
      return { width: "41%" }
    },
  },
]

export const ExamsTable = ({ exams }) => (
  <Row>
    <BootstrapTable
      keyField="id"
      columns={columns}
      data={exams}
      hover={true}
      condensed={true}
      wrapperClasses="no-more-tables"></BootstrapTable>
  </Row>
)

ExamsTable.propTypes = {
  exams: PropTypes.array.isRequired,
}

export default ExamsTable
