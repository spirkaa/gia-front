import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { EmpTable } from "./EmpTable"

const employees = [
  { id: "e1", name: "Иван Иванов", org: { id: "o1", name: "Школа 1" } },
  { id: "e2", name: "Пётр Петров", org: { id: "o2", name: "Школа 2" } },
]

const renderTable = (data = employees) =>
  render(
    <MemoryRouter>
      <EmpTable employees={data} />
    </MemoryRouter>,
  )

describe("employees EmpTable", () => {
  it("renders the column headers and hides the pk column", () => {
    renderTable()
    expect(screen.getByText("ФИО")).toBeInTheDocument()
    expect(screen.getByText("Место работы")).toBeInTheDocument()
    expect(screen.queryByText("pk")).not.toBeInTheDocument()
  })

  it("renders each employee as a link to its detail page", () => {
    renderTable()
    expect(screen.getByRole("link", { name: "Иван Иванов" })).toHaveAttribute(
      "href",
      "/employees/detail/e1",
    )
    expect(screen.getByRole("link", { name: "Пётр Петров" })).toHaveAttribute(
      "href",
      "/employees/detail/e2",
    )
  })

  it("renders the organisation of each employee as a link", () => {
    renderTable()
    expect(screen.getByRole("link", { name: "Школа 1" })).toHaveAttribute(
      "href",
      "/organisations/detail/o1",
    )
    expect(screen.getByRole("link", { name: "Школа 2" })).toHaveAttribute(
      "href",
      "/organisations/detail/o2",
    )
  })

  it("renders an empty table without crashing", () => {
    renderTable([])
    expect(screen.getByText("ФИО")).toBeInTheDocument()
  })
})
