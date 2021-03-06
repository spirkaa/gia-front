import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Col, Row } from "react-bootstrap"
import { loadOrganisations } from "../actions"
import { organisationsOnPageSelector, countSelector } from "../selectors"
import { Header } from "../../main/components"
import { OrgTable } from "../components"
import Filter from "./Filter"
import Pagination from "./Pagination"

class Organisations extends Component {
  componentDidMount() {
    this.props.loadOrganisations()
  }

  render() {
    const header = "Организации сотрудников, участвующих в ГИА"
    const { organisations, count } = this.props
    return (
      <div>
        <Header header={header} subHeader={count} />
        <Filter />
        <Row>
          <Col lg={1}></Col>
          <Col lg={10}>
            <OrgTable organisations={organisations} />
            <Pagination />
          </Col>
          <Col lg={1}></Col>
        </Row>
      </div>
    )
  }
}

Organisations.propTypes = {
  organisations: PropTypes.array.isRequired,
  count: PropTypes.number,
  loadOrganisations: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  organisations: organisationsOnPageSelector(state),
  count: countSelector(state),
})

export default connect(mapStateToProps, {
  loadOrganisations,
})(Organisations)
