import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { loadExams } from '../actions'
import { Header } from '../../main/components'
import { ExamsTable } from '../components'
import FilterContainer from './FilterContainer'
import Pagination from './Pagination'

class Exams extends Component {
  componentDidMount () {
    this.props.loadExams()
  }

  render () {
    const header = 'Распределение сотрудников в ППЭ'
    const { exams, count } = this.props
    return (
      <Col lg={12}>
        <Header header={header} subHeader={count}/>
        <FilterContainer />
        <ExamsTable exams={exams}/>
        <Pagination />
      </Col>
    )
  }
}

Exams.propTypes = {
  exams: PropTypes.array.isRequired,
  count: PropTypes.number,
  loadExams: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    entities: { examPage, employee, exam,
      date, level, position, organisation, place },
    pagination: { examActivePage }
  } = state
  const { count } = examPage[ 1 ] || { count: null }
  const currentPage = examPage[ examActivePage ] || { results: [] }
  const examsOnPage = currentPage.results.map(id => exam[ id ])
  const examsDetailed = examsOnPage.map(ex => ({
    ...ex,
    date: date[ ex.date ].date,
    level: level[ ex.level ].level,
    position: position[ ex.position ].name,
    place: place[ ex.place ],
    employee: {
      ...employee[ ex.employee ],
      org: organisation[employee[ ex.employee ].org]
    }
  }))
  return ({
    exams: examsDetailed,
    count
  })
}

export default connect(mapStateToProps, {
  loadExams
})(Exams)
