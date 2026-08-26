import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { OrgTable } from "./OrgTable"

const organisations = [
  { id: "o1", name: "Школа 1" },
  { id: "o2", name: "Лицей 2" },
]

const renderTable = (data = organisations) =>
  render(
    <MemoryRouter>
      <OrgTable organisations={data} />
    </MemoryRouter>,
  )

describe("organisations OrgTable", () => {
  it("renders the header and hides the pk column", () => {
    renderTable()
    expect(screen.getByText("Образовательная организация")).toBeInTheDocument()
    expect(screen.queryByText("pk")).not.toBeInTheDocument()
  })

  it("renders each organisation as a link to its detail page", () => {
    renderTable()
    expect(screen.getByRole("link", { name: "Школа 1" })).toHaveAttribute(
      "href",
      "/organisations/detail/o1",
    )
    expect(screen.getByRole("link", { name: "Лицей 2" })).toHaveAttribute(
      "href",
      "/organisations/detail/o2",
    )
  })
})
