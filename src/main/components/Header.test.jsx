import { render, screen } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { describe, expect, it } from "vitest"

import { Header } from "./Header"

const renderHeader = (props) =>
  render(
    <HelmetProvider>
      <Header {...props} />
    </HelmetProvider>,
  )

describe("Header", () => {
  it("renders the title and updates the document title", () => {
    renderHeader({ header: "Экзамены" })
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Экзамены")
    expect(document.title).toBe("Экзамены")
  })

  it("shows a placeholder when there is no subheader", () => {
    renderHeader({ header: "Экзамены" })
    expect(screen.getByText("...")).toBeInTheDocument()
  })

  it("renders a string subheader", () => {
    renderHeader({ header: "Экзамены", subHeader: "Список экзаменов" })
    expect(screen.getByText("Список экзаменов")).toBeInTheDocument()
    expect(screen.queryByText("...")).not.toBeInTheDocument()
  })

  it("renders an element subheader", () => {
    renderHeader({
      header: "Иван",
      subHeader: <span className="org">Школа 1</span>,
    })
    expect(screen.getByText("Школа 1")).toHaveClass("org")
  })
})
