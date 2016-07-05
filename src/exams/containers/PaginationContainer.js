import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadExams, examPageSet } from '../actions'
import { PaginationAdvanced } from '../../main/components'
import { EXAM_FILTER_INITIAL_STATE } from '../reducer'

class PaginationContainer extends Component {
  constructor (props) {
    super(props)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
  }

  handlePaginationClick (pageNum) {
    if (pageNum !== this.props.examActivePage) {
      const { examPageSet, loadExams, examFilter } = this.props
      examPageSet(pageNum)
      if (!isEqual(examFilter, EXAM_FILTER_INITIAL_STATE)) {
        loadExams(pageNum, examFilter)
      } else {
        loadExams(pageNum)
      }
    }
  }

  render () {
    const { examActivePage, count } = this.props
    console.log('PaginationContainer render')
    return (count
        ? <PaginationAdvanced
        onPaginationClick={this.handlePaginationClick}
        activePage={examActivePage}
        pageCount={Math.ceil(count / 50)}/>
        : null
    )
  }
}

PaginationContainer.propTypes = {
  examActivePage: PropTypes.number.isRequired,
  count: PropTypes.number,
  examFilter: PropTypes.object.isRequired,
  loadExams: PropTypes.func.isRequired,
  examPageSet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    entities: { examPage },
    filters: { examFilter },
    pagination: { examActivePage }
  } = state
  const { count } = examPage[ 1 ] || { count: null }
  return ({
    examActivePage,
    count,
    examFilter
  })
}

export default connect(mapStateToProps, {
  loadExams,
  examPageSet
})(PaginationContainer)
