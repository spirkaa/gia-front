import React, { Component } from "react" // eslint-disable-line
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { UltimatePagination } from "../../main/components"
import { subsLoad, subsPageSet } from "../actions"
import { countSelector, subsActivePageSelector } from "../selectors"

class Pagination extends Component {
  constructor(props) {
    super(props)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
  }

  handlePaginationClick(pageNum) {
    if (pageNum !== this.props.activePage) {
      const { token, setPage, loadNext } = this.props
      setPage(pageNum)
      loadNext(token, pageNum)
    }
  }

  render() {
    const { activePage, count } = this.props
    return count > 50 ? (
      <UltimatePagination
        onChange={this.handlePaginationClick}
        currentPage={activePage}
        totalPages={Math.ceil(count / 50)}
      />
    ) : null
  }
}

Pagination.propTypes = {
  token: PropTypes.string.isRequired,
  activePage: PropTypes.number.isRequired,
  count: PropTypes.number,
  loadNext: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  activePage: subsActivePageSelector(state),
  count: countSelector(state),
})

export default connect(mapStateToProps, {
  loadNext: subsLoad,
  setPage: subsPageSet,
})(Pagination)
