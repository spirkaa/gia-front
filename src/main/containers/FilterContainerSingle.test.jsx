import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import FilterContainer from "./FilterContainerSingle"

const makeProps = (filterVals = { search: "" }) => ({
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

describe("FilterContainerSingle", () => {
  it("pre-fills the input with the current filter value", () => {
    const { container } = renderFilter({ search: "иван" })
    expect(container.querySelector("input")).toHaveValue("иван")
  })

  it("shows the clear button only when the search is non-empty", () => {
    const empty = renderFilter({ search: "" })
    expect(empty.queryByRole("button", { name: "Очистить" })).not.toBeInTheDocument()
    empty.unmount()

    renderFilter({ search: "иван" })
    expect(screen.getByRole("button", { name: "Очистить" })).toBeInTheDocument()
  })

  it("notifies all handlers when the search is submitted", async () => {
    const user = userEvent.setup()
    const { loadFiltered, filterSet, filterClearPages, pageSet } = renderFilter()
    await user.type(screen.getByRole("textbox"), "иван")
    await user.click(screen.getByRole("button", { name: "Найти" }))
    expect(filterSet).toHaveBeenCalledWith({ search: "иван" })
    expect(filterClearPages).toHaveBeenCalledTimes(1)
    expect(loadFiltered).toHaveBeenCalledWith(1, { search: "иван" })
    expect(pageSet).toHaveBeenCalledWith(1)
  })

  it("does not notify the handlers when the submitted value is unchanged", async () => {
    const user = userEvent.setup()
    const { loadFiltered, filterSet, filterClearPages, pageSet } = renderFilter({
      search: "иван",
    })
    await user.click(screen.getByRole("button", { name: "Найти" }))
    expect(filterSet).not.toHaveBeenCalled()
    expect(filterClearPages).not.toHaveBeenCalled()
    expect(loadFiltered).not.toHaveBeenCalled()
    expect(pageSet).not.toHaveBeenCalled()
  })

  it("resets the input and notifies with an empty search", async () => {
    const user = userEvent.setup()
    const { container, loadFiltered, filterSet } = renderFilter({ search: "иван" })
    await user.click(screen.getByRole("button", { name: "Очистить" }))
    expect(container.querySelector("input")).toHaveValue("")
    expect(filterSet).toHaveBeenCalledWith({ search: "" })
    expect(loadFiltered).toHaveBeenCalledWith(1, { search: "" })
  })

  it("submits when Enter is pressed", () => {
    const { filterSet } = renderFilter()
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "иван" } })
    fireEvent.keyUp(input, { keyCode: 13, key: "Enter", code: "Enter" })
    expect(filterSet).toHaveBeenCalledWith({ search: "иван" })
  })
})
