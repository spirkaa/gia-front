import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Col, Row } from "react-bootstrap"
import { Header } from "../../main/components"
import { loadExams } from "../actions"
import { examsWithDetailsSelector, countSelector } from "../selectors"
import { ExamsTable } from "../components"
import FilterContainer from "./FilterContainer"
import Pagination from "./Pagination"

class Exams extends Component {
  componentDidMount() {
    this.props.loadExams()
  }

  render() {
    const header = "Список организаторов ЕГЭ и ОГЭ"
    const { exams, count } = this.props
    return (
      <div>
        <Header header={header} subHeader={count} />
        <FilterContainer />
        <Row>
          <Col lg={12}>
            <ExamsTable exams={exams} />
            <Pagination />
          </Col>
        </Row>
      </div>
    )
  }
}

Exams.propTypes = {
  exams: PropTypes.array.isRequired,
  count: PropTypes.number,
  loadExams: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  exams: examsWithDetailsSelector(state),
  count: countSelector(state),
})

export default connect(mapStateToProps, {
  loadExams,
})(Exams)
