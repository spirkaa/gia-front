import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { PlacesTable } from "./PlacesTable"

const places = [
  { id: "p1", code: "123", name: "Школа 1", addr: "ул. X, 1" },
  { id: "p2", code: "456", name: "Школа 2", addr: "ул. Y, 2" },
]

const renderTable = (data = places) =>
  render(
    <MemoryRouter>
      <PlacesTable places={data} />
    </MemoryRouter>,
  )

describe("places PlacesTable", () => {
  it("renders the header and hides the pk column", () => {
    renderTable()
    expect(screen.getByText("Код, наименование, адрес ППЭ")).toBeInTheDocument()
    expect(screen.queryByText("pk")).not.toBeInTheDocument()
  })

  it("renders the code and the name of each place", () => {
    renderTable()
    expect(screen.getByText("№123: Школа 1")).toBeInTheDocument()
    expect(screen.getByText("№456: Школа 2")).toBeInTheDocument()
  })

  it("renders the address as a map link", () => {
    renderTable()
    const addr = screen.getByText("ул. X, 1")
    const link = addr.closest("a")
    expect(link).toHaveAttribute(
      "href",
      encodeURI(`https://yandex.ru/maps/?text=ул. X, 1`),
    )
    expect(link).toHaveAttribute("target", "_blank")
  })
})
