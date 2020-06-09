import React from "react"
import PropTypes from "prop-types"
import { Pagination } from "react-bootstrap"
import { createUltimatePagination, ITEM_TYPES } from "react-ultimate-pagination"

export const UltimatePagination = createUltimatePagination({
  WrapperComponent: Pagination,
  itemTypeToComponent: {
    [ITEM_TYPES.PAGE]: ({ value, isActive, onClick }) => (
      <Pagination.Item active={isActive} onClick={onClick}>
        {value}
      </Pagination.Item>
    ),
    [ITEM_TYPES.ELLIPSIS]: () => <Pagination.Ellipsis disabled />,
    [ITEM_TYPES.FIRST_PAGE_LINK]: ({ isActive, onClick }) => (
      <Pagination.First disabled={isActive} onClick={onClick} />
    ),
    [ITEM_TYPES.PREVIOUS_PAGE_LINK]: ({ isActive, onClick }) => (
      <Pagination.Prev disabled={isActive} onClick={onClick} />
    ),
    [ITEM_TYPES.NEXT_PAGE_LINK]: ({ isActive, onClick }) => (
      <Pagination.Next disabled={isActive} onClick={onClick} />
    ),
    [ITEM_TYPES.LAST_PAGE_LINK]: ({ isActive, onClick }) => (
      <Pagination.Last disabled={isActive} onClick={onClick} />
    ),
  },
})

UltimatePagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onChange: PropTypes.func,
  boundaryPagesRange: PropTypes.number,
  siblingPagesRange: PropTypes.number,
  hideEllipsis: PropTypes.bool,
  hidePreviousAndNextPageLinks: PropTypes.bool,
  hideFirstAndLastPageLinks: PropTypes.bool,
  disabled: PropTypes.bool,
}

UltimatePagination.defaultProps = {
  currentPage: 1,
  totalPages: 1,
  onChange: () => undefined,
  boundaryPagesRange: 1,
  siblingPagesRange: 3,
  hideEllipsis: false,
  hidePreviousAndNextPageLinks: false,
  hideFirstAndLastPageLinks: false,
  disabled: false,
}

export default UltimatePagination
