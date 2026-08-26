import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import FilterContainer from "./FilterContainer"

const makeProps = (filterVals = { search: "" }) => ({
  Filter: ({ filterVals, onChange }) => (
    <div>
      <span data-testid="vals">{JSON.stringify(filterVals)}</span>
      <button onClick={() => onChange({ ...filterVals, search: "новый" })}>
        изменить
      </button>
    </div>
  ),
  filterVals,
  loadFiltered: vi.fn(),
  filterSet: vi.fn(),
  filterClearPages: vi.fn(),
  pageSet: vi.fn(),
})

const renderFilter = (filterVals = { search: "" }) => {
  const props = makeProps(filterVals)
  const utils = render(<FilterContainer {...props} />)
  return { ...props, ...utils }
}

describe("FilterContainer", () => {
  it("passes the current filter values to the child filter", () => {
    renderFilter({ search: "иван" })
    expect(screen.getByTestId("vals")).toHaveTextContent('{"search":"иван"}')
  })

  it("forwards a changed filter to all the handlers", async () => {
    const user = userEvent.setup()
    const { loadFiltered, filterSet, filterClearPages, pageSet } = renderFilter()
    await user.click(screen.getByRole("button", { name: "изменить" }))
    expect(filterSet).toHaveBeenCalledWith({ search: "новый" })
    expect(filterClearPages).toHaveBeenCalledTimes(1)
    expect(loadFiltered).toHaveBeenCalledWith(1, { search: "новый" })
    expect(pageSet).toHaveBeenCalledWith(1)
  })

  it("does not call the handlers when the child reports the same values", async () => {
    const user = userEvent.setup()
    const loadFiltered = vi.fn()
    const filterSet = vi.fn()
    const filterClearPages = vi.fn()
    const pageSet = vi.fn()
    render(
      <FilterContainer
        Filter={({ onChange }) => (
          <button onClick={() => onChange({ search: "" })}>без изменений</button>
        )}
        filterVals={{ search: "" }}
        loadFiltered={loadFiltered}
        filterSet={filterSet}
        filterClearPages={filterClearPages}
        pageSet={pageSet}
      />,
    )
    await user.click(screen.getByRole("button", { name: "без изменений" }))
    expect(filterSet).not.toHaveBeenCalled()
    expect(filterClearPages).not.toHaveBeenCalled()
    expect(loadFiltered).not.toHaveBeenCalled()
    expect(pageSet).not.toHaveBeenCalled()
  })
})
