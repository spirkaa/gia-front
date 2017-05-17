import React from 'react'
import PropTypes from 'prop-types'
import { Pagination, Pager, PageItem } from 'react-bootstrap'

export const PaginationAdvanced = ({ onPaginationClick, activePage, pageCount }) => (
  <Pagination
    prev
    next
    first
    last
    ellipsis
    boundaryLinks
    items={pageCount}
    maxButtons={7}
    activePage={activePage}
    onSelect={onPaginationClick}/>
)

export const PaginationPager = (
  { onPaginationClick, loading, first, next, previous, last }) => (
  <Pager>
    <PageItem
      onClick={() => onPaginationClick(first)}
      disabled={loading || !previous}>«</PageItem>{' '}
    <PageItem
      onClick={() => onPaginationClick(previous)}
      disabled={loading || !previous}>‹</PageItem>{' '}
    <PageItem
      onClick={() => onPaginationClick(next)}
      disabled={loading || !next}>›</PageItem>{' '}
    <PageItem
      onClick={() => onPaginationClick(last)}
      disabled={loading || !next}>»</PageItem>
  </Pager>
)

PaginationPager.propTypes = {
  onPaginationClick: PropTypes.func,
  loading: PropTypes.bool,
  first: PropTypes.string,
  next: PropTypes.string,
  previous: PropTypes.string,
  last: PropTypes.string
}

PaginationAdvanced.propTypes = {
  onPaginationClick: PropTypes.func,
  activePage: PropTypes.number,
  pageCount: PropTypes.number
}

export default PaginationAdvanced