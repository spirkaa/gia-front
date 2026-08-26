import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Footer } from "./Footer"

const year = new Date().getFullYear()

describe("Footer", () => {
  it("shows the copyright range and the devmem.ru link", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "devmem.ru" })).toHaveAttribute(
      "href",
      "https://devmem.ru",
    )
    expect(screen.getByText(new RegExp(`2016-${year}`))).toBeInTheDocument()
  })
})
