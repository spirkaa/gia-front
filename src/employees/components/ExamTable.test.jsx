import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ExamTable } from "./ExamTable"

const exams = [
  {
    id: "x1",
    date: "2025-06-01",
    level: "ГИА",
    position: "Председатель ППЭ",
    place: { id: "pl1", code: "123", name: "Школа 1", addr: "ул. X, 1" },
  },
]

const renderTable = (data = exams) => render(<ExamTable exams={data} />)

describe("employees ExamTable", () => {
  it("renders the column headers and hides the pk column", () => {
    renderTable()
    expect(screen.getByText("Дата")).toBeInTheDocument()
    expect(screen.getByText("Уровень")).toBeInTheDocument()
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

  it("renders the level and the position", () => {
    renderTable()
    expect(screen.getByText("ГИА")).toBeInTheDocument()
    expect(screen.getByText("Председатель ППЭ")).toBeInTheDocument()
  })

  it("renders the place code and name with a map link", () => {
    renderTable()
    expect(screen.getByText("№123: Школа 1")).toBeInTheDocument()
    const addr = screen.getByText("ул. X, 1")
    const link = addr.closest("a")
    expect(link).toHaveAttribute(
      "href",
      encodeURI(`https://yandex.ru/maps/?text=ул. X, 1`),
    )
    expect(link).toHaveAttribute("target", "_blank")
  })
})
