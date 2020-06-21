import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Col, Row } from "react-bootstrap"
import { Header } from "../../main/components"
import { loadPlaces } from "../actions"
import { placesOnPageSelector, countSelector } from "../selectors"
import { PlacesTable } from "../components"
import Filter from "./Filter"
import Pagination from "./Pagination"

class Places extends Component {
  componentDidMount() {
    this.props.loadPlaces()
  }

  render() {
    const header = "Список ППЭ (пункты проведения экзаменов)"
    const { places, count } = this.props
    return (
      <div>
        <Header header={header} subHeader={count} />
        <Filter />
        <Row>
          <Col lg={1}></Col>
          <Col lg={10}>
            <PlacesTable places={places} />
            <Pagination />
          </Col>
          <Col lg={1}></Col>
        </Row>
      </div>
    )
  }
}

Places.propTypes = {
  places: PropTypes.array.isRequired,
  count: PropTypes.number,
  loadPlaces: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  places: placesOnPageSelector(state),
  count: countSelector(state),
})

export default connect(mapStateToProps, {
  loadPlaces,
})(Places)
