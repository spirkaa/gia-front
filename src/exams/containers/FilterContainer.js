import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadExams, loadDates, loadLevels, examFilterSet, examPageSet } from '../actions'
import { examFilterClearPages } from '../../main/actions'
import { Filter } from '../components'

class FilterContainer extends Component {
  constructor (props) {
    super(props)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange (examFilter) {
    if (!isEqual(examFilter, this.props.examFilter)) {
      const { examFilterSet, loadExams, examFilterClearPages, examPageSet } = this.props
      examFilterSet(examFilter)
      examFilterClearPages()
      loadExams(1, examFilter)
      examPageSet(1)
    }
  }

  componentDidMount () {
    this.props.loadDates()
    this.props.loadLevels()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !isEqual(nextProps, this.props)
  }

  render () {
    const { examFilter, dates, levels } = this.props
    const dateList = dates.map(date => date.date) || []
    const levelList = levels.map(level => level.level) || []
    return (
      <Filter
        examFilter={examFilter}
        dateList={dateList}
        levelList={levelList}
        onChange={this.handleFilterChange}
      />
    )
  }
}

FilterContainer.propTypes = {
  examFilter: PropTypes.object.isRequired,
  dates: PropTypes.array.isRequired,
  levels: PropTypes.array.isRequired,
  loadExams: PropTypes.func.isRequired,
  loadDates: PropTypes.func.isRequired,
  loadLevels: PropTypes.func.isRequired,
  examFilterSet: PropTypes.func.isRequired,
  examFilterClearPages: PropTypes.func.isRequired,
  examPageSet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    entities: { datePage, levelPage, date, level },
    filters: { examFilter }
  } = state
  const currentDatePage = datePage[ 1 ] || { results: [] }
  const dates = currentDatePage.results.map(id => date[ id ])
  const currentLevelPage = levelPage[ 1 ] || { results: [] }
  const levels = currentLevelPage.results.map(id => level[ id ])

  return ({
    examFilter,
    dates,
    levels
  })
}

export default connect(mapStateToProps, {
  loadExams,
  loadDates,
  loadLevels,
  examFilterSet,
  examFilterClearPages,
  examPageSet
})(FilterContainer)