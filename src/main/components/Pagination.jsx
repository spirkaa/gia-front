import PropTypes from "prop-types"
import { Pagination } from "react-bootstrap"

const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

const page = (value, currentPage) => ({
  type: "page",
  value,
  isActive: value === currentPage,
})

const getPages = ({
  currentPage,
  totalPages,
  boundaryPagesRange,
  siblingPagesRange,
  hideEllipsis,
}) => {
  const ellipsisSize = hideEllipsis ? 0 : 1
  if (
    1 + 2 * ellipsisSize + 2 * siblingPagesRange + 2 * boundaryPagesRange >=
    totalPages
  ) {
    return range(1, totalPages).map((n) => page(n, currentPage))
  }
  const lastPagesStart = totalPages + 1 - boundaryPagesRange
  const mainPagesStart = Math.min(
    Math.max(currentPage - siblingPagesRange, boundaryPagesRange + ellipsisSize + 1),
    lastPagesStart - ellipsisSize - 2 * siblingPagesRange - 1,
  )
  const mainPagesEnd = mainPagesStart + 2 * siblingPagesRange
  const items = range(1, boundaryPagesRange).map((n) => page(n, currentPage))
  if (!hideEllipsis) {
    const firstEllipsis = mainPagesStart - 1
    if (firstEllipsis === boundaryPagesRange + 1)
      items.push(page(firstEllipsis, currentPage))
    else items.push({ type: "ellipsis", value: firstEllipsis })
  }
  items.push(...range(mainPagesStart, mainPagesEnd).map((n) => page(n, currentPage)))
  if (!hideEllipsis) {
    const secondEllipsis = mainPagesEnd + 1
    if (secondEllipsis === lastPagesStart - 1)
      items.push(page(secondEllipsis, currentPage))
    else items.push({ type: "ellipsis", value: secondEllipsis })
  }
  items.push(...range(lastPagesStart, totalPages).map((n) => page(n, currentPage)))
  return items
}

export const UltimatePagination = ({
  currentPage = 1,
  totalPages = 1,
  onChange = () => undefined,
  boundaryPagesRange = 1,
  siblingPagesRange = 3,
  hideEllipsis = false,
  hidePreviousAndNextPageLinks = false,
  hideFirstAndLastPageLinks = false,
  disabled = false,
  ...rest
}) => {
  const pages = getPages({
    currentPage,
    totalPages,
    boundaryPagesRange,
    siblingPagesRange,
    hideEllipsis,
  })
  const click = (value) => () => {
    if (!disabled && currentPage !== value) onChange(value)
  }
  return (
    <Pagination {...rest}>
      {!hideFirstAndLastPageLinks && (
        <Pagination.First disabled={currentPage === 1} onClick={click(1)} />
      )}
      {!hidePreviousAndNextPageLinks && (
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={click(Math.max(1, currentPage - 1))}
        />
      )}
      {pages.map((item) =>
        item.type === "ellipsis" ? (
          <Pagination.Ellipsis key={`e-${item.value}`} disabled />
        ) : (
          <Pagination.Item
            key={item.value}
            active={item.isActive}
            onClick={click(item.value)}>
            {item.value}
          </Pagination.Item>
        ),
      )}
      {!hidePreviousAndNextPageLinks && (
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={click(Math.min(totalPages, currentPage + 1))}
        />
      )}
      {!hideFirstAndLastPageLinks && (
        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={click(totalPages)}
        />
      )}
    </Pagination>
  )
}

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
