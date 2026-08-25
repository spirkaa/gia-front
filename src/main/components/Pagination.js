import React from "react"
import PropTypes from "prop-types"
import { Pagination } from "react-bootstrap"
import { createUltimatePagination, ITEM_TYPES } from "react-ultimate-pagination"

const UltimatePaginationBase = createUltimatePagination({
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

const UltimatePaginationDefaults = {
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

export const UltimatePagination = (props) => (
  <UltimatePaginationBase {...UltimatePaginationDefaults} {...props} />
)

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

export default UltimatePagination
