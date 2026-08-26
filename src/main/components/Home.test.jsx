import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { Home } from "./Home"

const year = new Date().getFullYear()

describe("Home", () => {
  const renderHome = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

  it("shows the heading and the RCOI source", () => {
    renderHome()
    expect(
      screen.getByRole("heading", { level: 1, name: "Список организаторов ППЭ" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "РЦОИ города Москвы" })).toHaveAttribute(
      "href",
      "http://rcoi.mcko.ru",
    )
  })

  it("mentions the previous academic year", () => {
    renderHome()
    expect(screen.getByText(new RegExp(`${year - 1}/${year}`))).toBeInTheDocument()
  })

  it("links the search button to the exams page", () => {
    renderHome()
    const button = screen.getByRole("button", { name: "Перейти к поиску" })
    expect(button).toHaveAttribute("href", "/exams")
  })
})
