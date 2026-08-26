import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { EmpTable } from "./EmpTable"

const employees = [
  { id: "e1", name: "Иван Иванов", num_exams: 1 },
  { id: "e2", name: "Пётр Петров", num_exams: 2 },
]

const renderTable = (data = employees) =>
  render(
    <MemoryRouter>
      <EmpTable employees={data} />
    </MemoryRouter>,
  )

describe("organisations EmpTable", () => {
  it("renders the headers and hides the pk column", () => {
    renderTable()
    expect(screen.getByText("ФИО")).toBeInTheDocument()
    expect(screen.getByText("Количество экзаменов")).toBeInTheDocument()
    expect(screen.queryByText("pk")).not.toBeInTheDocument()
  })

  it("renders each employee as a link to its detail page", () => {
    renderTable()
    expect(screen.getByRole("link", { name: "Иван Иванов" })).toHaveAttribute(
      "href",
      "/employees/detail/e1",
    )
  })

  it("renders the number of exams of each employee", () => {
    renderTable()
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })
})
