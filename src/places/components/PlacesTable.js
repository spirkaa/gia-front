import React from "react"
import PropTypes from "prop-types"
import { Glyphicon } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"

const placeFormat = (cell, row) => (
  <div>
    №{row.code}: {row.name}
    <br />
    <a
      href={`https://yandex.ru/maps/?text=${row.addr}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Открыть карту">
      <small>
        <Glyphicon glyph="map-marker" /> {row.addr}
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
    dataField: "name",
    text: "Код, наименование, адрес ППЭ",
    formatter: placeFormat,
  },
]

export const PlacesTable = ({ places }) => (
  <BootstrapTable
    keyField="id"
    columns={columns}
    data={places}
    hover={true}
    condensed={true}></BootstrapTable>
)

PlacesTable.propTypes = {
  places: PropTypes.array.isRequired,
}

export default PlacesTable
