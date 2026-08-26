import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { ExamsTable } from "./ExamsTable"

const exams = [
  {
    id: "x1",
    date: "2025-06-01",
    level: "ГИА",
    employee: { id: "e1", name: "Иван Иванов", org: { id: "o1", name: "Школа 1" } },
    position: "Председатель ППЭ",
    place: { id: "pl1", code: "123", name: "Школа 1", addr: "ул. X, 1" },
  },
]

const renderTable = (data = exams) =>
  render(
    <MemoryRouter>
      <ExamsTable exams={data} />
    </MemoryRouter>,
  )

describe("exams ExamsTable", () => {
  it("renders the column headers and hides the pk column", () => {
    renderTable()
    expect(screen.getByText("Дата")).toBeInTheDocument()
    expect(screen.getByText("Уровень")).toBeInTheDocument()
    expect(screen.getByText("Сотрудник")).toBeInTheDocument()
    expect(screen.getByText("Должность")).toBeInTheDocument()
    expect(screen.getByText("ППЭ")).toBeInTheDocument()
    expect(screen.queryByText("pk")).not.toBeInTheDocument()
  })

  it("formats the exam date in Russian", () => {
    renderTable()
    expect(
      screen.getByText(new Date("2025-06-01").toLocaleDateString("ru")),
    ).toBeInTheDocument()
  })

  it("renders the employee as a link to the employee detail", () => {
    renderTable()
    expect(screen.getByRole("link", { name: "Иван Иванов" })).toHaveAttribute(
      "href",
      "/employees/detail/e1",
    )
  })

  it("renders the employee organisation as a link to the organisation detail", () => {
    renderTable()
    expect(screen.getByRole("link", { name: "Школа 1" })).toHaveAttribute(
      "href",
      "/organisations/detail/o1",
    )
  })

  it("renders the place code and name with a map link", () => {
    renderTable()
    expect(screen.getByText("№123: Школа 1")).toBeInTheDocument()
    const addr = screen.getByText("ул. X, 1")
    expect(addr.closest("a")).toHaveAttribute(
      "href",
      encodeURI(`https://yandex.ru/maps/?text=ул. X, 1`),
    )
  })
})
