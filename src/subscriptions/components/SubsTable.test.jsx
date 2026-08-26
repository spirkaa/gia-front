import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { SubsTable } from "./SubsTable"

const subscriptions = [
  {
    id: "s1",
    employee: {
      id: "e1",
      name: "Иван Иванов",
      org: { id: "o1", name: "Школа 1" },
      exams: [],
    },
  },
  {
    id: "s2",
    employee: {
      id: "e2",
      name: "Пётр Петров",
      org: { id: "o2", name: "Школа 2" },
      exams: [],
    },
  },
]

const renderTable = (onDelete = vi.fn()) =>
  render(
    <MemoryRouter>
      <SubsTable subscriptions={subscriptions} onDelete={onDelete} token="tok" />
    </MemoryRouter>,
  )

// react-bootstrap-table-ng v5 invokes onSelect from inside its own setState
// updater, so React warns (once per module) that SubsTable's setState runs
// during an existing state transition. The warning is a library quirk and
// the selection state ends up correct, so filter it out for this file only.
const realConsoleError = console.error

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation((...args) => {
    if (String(args[0]).includes("Cannot update during an existing state transition")) {
      return
    }
    realConsoleError(...args)
  })
})

afterAll(() => {
  vi.restoreAllMocks()
})

describe("subscriptions SubsTable", () => {
  it("renders the headers and hides the pk column", () => {
    renderTable()
    expect(screen.getByText("ФИО")).toBeInTheDocument()
    expect(screen.getByText("Место работы")).toBeInTheDocument()
    expect(screen.queryByText("pk")).not.toBeInTheDocument()
  })

  it("renders the employee and the organisation as links", () => {
    renderTable()
    expect(screen.getByRole("link", { name: "Иван Иванов" })).toHaveAttribute(
      "href",
      "/employees/detail/e1",
    )
    expect(screen.getByRole("link", { name: "Школа 1" })).toHaveAttribute(
      "href",
      "/organisations/detail/o1",
    )
  })

  it("disables the delete button until a row is selected", () => {
    renderTable()
    expect(screen.getByRole("button", { name: /Отменить подписку/ })).toBeDisabled()
  })

  it("deletes the selected rows and notifies", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderTable(onDelete)
    const [selectAll, first] = screen.getAllByRole("checkbox")
    await user.click(first)
    const deleteButton = screen.getByRole("button", { name: /Отменить подписку/ })
    expect(deleteButton).toBeEnabled()
    await user.click(deleteButton)
    expect(onDelete).toHaveBeenCalledWith("tok", "s1")
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(selectAll).not.toBeChecked()
  })

  it("deletes all rows when the select-all box is used", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderTable(onDelete)
    const [selectAll] = screen.getAllByRole("checkbox")
    await user.click(selectAll)
    await user.click(screen.getByRole("button", { name: /Отменить подписку/ }))
    expect(onDelete).toHaveBeenCalledTimes(2)
    expect(onDelete).toHaveBeenNthCalledWith(1, "tok", "s1")
    expect(onDelete).toHaveBeenNthCalledWith(2, "tok", "s2")
  })

  it("disables the delete button again when the last row is deselected", async () => {
    const user = userEvent.setup()
    renderTable()
    const [, first, second] = screen.getAllByRole("checkbox")
    await user.click(first)
    await user.click(second)
    expect(screen.getByRole("button", { name: /Отменить подписку/ })).toBeEnabled()
    await user.click(second)
    await user.click(first)
    expect(screen.getByRole("button", { name: /Отменить подписку/ })).toBeDisabled()
  })
})
