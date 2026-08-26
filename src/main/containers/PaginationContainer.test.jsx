import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import PaginationContainer from "./PaginationContainer"

const makeProps = (overrides = {}) => ({
  activePage: 1,
  count: 120,
  filterVals: { search: "" },
  filterDefaultVals: { search: "" },
  loadNext: vi.fn(),
  setPage: vi.fn(),
  ...overrides,
})

describe("PaginationContainer", () => {
  it("renders pagination with a page count derived from the record count", () => {
    // 120 records at 50 per page -> 3 pages
    render(<PaginationContainer {...makeProps()} />)
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("renders nothing when the count is empty", () => {
    for (const count of [0, null]) {
      const { container, unmount } = render(
        <PaginationContainer {...makeProps({ count })} />,
      )
      expect(container.firstChild).toBeNull()
      unmount()
    }
  })

  it("ignores a click on the active page", () => {
    const props = makeProps()
    let instance = null
    render(
      <PaginationContainer
        {...props}
        ref={(ref) => {
          instance = ref
        }}
      />,
    )
    instance.handlePaginationClick(1)
    expect(props.setPage).not.toHaveBeenCalled()
    expect(props.loadNext).not.toHaveBeenCalled()
  })

  it("loads the next page without filter arguments when the filters are default", async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(<PaginationContainer {...props} />)
    await user.click(screen.getByText("2"))
    expect(props.setPage).toHaveBeenCalledWith(2)
    expect(props.loadNext).toHaveBeenCalledWith(2)
  })

  it("passes the current filter values when they differ from the defaults", async () => {
    const user = userEvent.setup()
    const filterVals = { search: "школа" }
    const props = makeProps({ filterVals })
    render(<PaginationContainer {...props} />)
    await user.click(screen.getByText("2"))
    expect(props.setPage).toHaveBeenCalledWith(2)
    expect(props.loadNext).toHaveBeenCalledWith(2, filterVals)
  })
})
