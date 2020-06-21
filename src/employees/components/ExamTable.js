import React from "react"
import PropTypes from "prop-types"
import { Glyphicon } from "react-bootstrap"
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
      return {
        width: "8%",
        maxWidth: "0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }
    },
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  {
    dataField: "level",
    text: "Уровень",
    attrs: { "data-title": "Уровень" },
    headerStyle: (column, colIndex) => {
      return {
        width: "4%",
        maxWidth: "0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }
    },
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  {
    dataField: "position",
    text: "Должность",
    attrs: { "data-title": "Должность" },
    headerStyle: (column, colIndex) => {
      return { width: "18%" }
    },
  },
  {
    dataField: "place",
    text: "ППЭ",
    formatter: placeFormat,
    attrs: { "data-title": "ППЭ" },
    headerStyle: (column, colIndex) => {
      return { width: "39%" }
    },
  },
]

export const ExamTable = ({ exams }) => (
  <BootstrapTable
    keyField="id"
    columns={columns}
    data={exams}
    hover={true}
    condensed={true}
    wrapperClasses="no-more-tables"></BootstrapTable>
)

ExamTable.propTypes = {
  exams: PropTypes.array.isRequired,
}

export default ExamTable
