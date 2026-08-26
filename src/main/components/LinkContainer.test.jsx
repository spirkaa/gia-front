import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { LinkContainer } from "./LinkContainer"

const renderAt = (path, to, label = "Link") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/a" element={<div>route a</div>} />
        <Route path="/b" element={<div>route b</div>} />
      </Routes>
      <LinkContainer to={to}>
        <a>{label}</a>
      </LinkContainer>
    </MemoryRouter>,
  )

describe("LinkContainer", () => {
  it("renders the child as an anchor pointing at the target route", () => {
    renderAt("/a", "/b")
    expect(screen.getByText("Link")).toHaveAttribute("href", "/b")
  })

  it("applies the active class when the current route matches", () => {
    renderAt("/b", "/b")
    expect(screen.getByText("Link")).toHaveClass("active")
  })

  it("does not apply the active class when the route does not match", () => {
    renderAt("/a", "/b")
    expect(screen.getByText("Link")).not.toHaveClass("active")
  })

  it("navigates on click instead of a full page load", async () => {
    renderAt("/a", "/b")
    await userEvent.click(screen.getByText("Link"))
    expect(screen.getByText("route b")).toBeInTheDocument()
  })
})
