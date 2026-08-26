import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { NotFound } from "./NotFound"

describe("NotFound", () => {
  it("tells the visitor the page is missing and offers the home link", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Страница не найдена/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "главную" })).toHaveAttribute("href", "/")
  })
})
