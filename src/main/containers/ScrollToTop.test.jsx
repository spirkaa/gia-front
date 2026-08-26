import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Link, MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import ScrollToTop from "./ScrollToTop"

describe("ScrollToTop", () => {
  let scrollToSpy

  beforeEach(() => {
    scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {})
  })

  afterEach(() => {
    scrollToSpy.mockRestore()
  })

  it("renders its children and scrolls to the top on mount", () => {
    render(
      <MemoryRouter initialEntries={["/a"]}>
        <ScrollToTop>
          <div>child content</div>
        </ScrollToTop>
      </MemoryRouter>,
    )
    expect(screen.getByText("child content")).toBeInTheDocument()
    expect(scrollToSpy).toHaveBeenCalledTimes(1)
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
  })

  it("scrolls to the top on every location change", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={["/a"]}>
        <ScrollToTop>
          <Link to="/b">to b</Link>
        </ScrollToTop>
      </MemoryRouter>,
    )
    expect(scrollToSpy).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole("link", { name: "to b" }))
    expect(scrollToSpy).toHaveBeenCalledTimes(2)
  })
})
