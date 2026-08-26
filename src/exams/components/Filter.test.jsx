import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { describe, expect, it, vi } from "vitest"

import { makeState } from "../../test/fixtures"
import rootReducer from "../../reducer"
import Filter from "./Filter"

const renderFilter = (onChange = vi.fn()) => {
  const store = createStore(
    rootReducer,
    makeState({
      entities: {
        datePage: { 1: { count: 1, results: ["d1"] } },
        levelPage: { 1: { count: 1, results: ["l1"] } },
        date: { d1: { id: "d1", date: "2025-06-01" } },
        level: { l1: { id: "l1", level: "ГИА" } },
      },
    }),
    applyMiddleware(thunk),
  )
  const utils = render(
    <Provider store={store}>
      <Filter filterVals={{ date: "", level: "", search: "" }} onChange={onChange} />
    </Provider>,
  )
  return {
    ...utils,
    dateToggle: () => utils.container.querySelector("#date"),
    levelToggle: () => utils.container.querySelector("#level"),
  }
}

const dateLabel = new Date("2025-06-01").toLocaleDateString("ru")

describe("exams Filter", () => {
  it("renders the date and level dropdowns, the search input and the submit button", async () => {
    const { dateToggle, levelToggle } = renderFilter()
    // DropdownMenu schedules an internal update right after mount; flushing
    // it inside act keeps React's "not wrapped in act" warning away.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })
    expect(dateToggle()).toBeInTheDocument()
    expect(levelToggle()).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Поиск" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Найти" })).toBeInTheDocument()
  })

  it("selecting a date formats it in Russian and submits it with the search", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { dateToggle } = renderFilter(onChange)
    await user.click(dateToggle())
    await user.click(screen.getByText(dateLabel, { exact: false }))
    await user.click(screen.getByRole("button", { name: "Найти" }))
    expect(onChange).toHaveBeenCalledWith({ date: dateLabel, level: "", search: "" })
  })

  it("selecting the same date again clears the selection", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { dateToggle } = renderFilter(onChange)
    await user.click(dateToggle())
    await user.click(screen.getByText(dateLabel, { exact: false }))
    await user.click(dateToggle())
    await user.click(screen.getByText(dateLabel, { exact: false }))
    await user.click(screen.getByRole("button", { name: "Найти" }))
    expect(onChange).toHaveBeenCalledWith({ date: "", level: "", search: "" })
  })

  it("selecting a level and submitting sends it", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { levelToggle } = renderFilter(onChange)
    await user.click(levelToggle())
    await user.click(screen.getByText("ГИА", { exact: false }))
    await user.click(screen.getByRole("button", { name: "Найти" }))
    expect(onChange).toHaveBeenCalledWith({ date: "", level: "ГИА", search: "" })
  })

  it("the reset button clears all the values", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { levelToggle } = renderFilter(onChange)
    await user.click(levelToggle())
    await user.click(screen.getByText("ГИА", { exact: false }))
    await user.click(screen.getByRole("button", { name: "Очистить" }))
    expect(onChange).toHaveBeenLastCalledWith({ date: "", level: "", search: "" })
  })
})
