import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { UltimatePagination } from "./Pagination"

// Maps the rendered react-bootstrap items back to a comparable sequence:
// "first" | "prev" | "next" | "last" | "ellipsis" | the page number.
const toSequence = (container) =>
  [...container.querySelectorAll("li.page-item")].map((li) => {
    const text = li.textContent
    if (text.includes("«")) return "first"
    if (text.includes("‹")) return "prev"
    if (text.includes("›")) return "next"
    if (text.includes("»")) return "last"
    if (text.includes("…")) return "ellipsis"
    return text.replace("(current)", "").trim()
  })

const renderPagination = (props) => {
  const utils = render(<UltimatePagination {...props} />)
  return { sequence: () => toSequence(utils.container), ...utils }
}

describe("UltimatePagination item sequence (parity with react-ultimate-pagination)", () => {
  it("shows a single page without ellipsis", () => {
    const { sequence } = renderPagination({ currentPage: 1, totalPages: 1 })
    expect(sequence()).toEqual(["first", "prev", "1", "next", "last"])
  })

  it("shows all pages when they fit (no ellipsis)", () => {
    for (const currentPage of [1, 3, 5]) {
      const { sequence } = renderPagination({ currentPage, totalPages: 5 })
      expect(sequence()).toEqual([
        "first",
        "prev",
        "1",
        "2",
        "3",
        "4",
        "5",
        "next",
        "last",
      ])
    }
  })

  it("keeps the boundary pages and the window around the first page", () => {
    const { sequence } = renderPagination({ currentPage: 1, totalPages: 20 })
    expect(sequence()).toEqual([
      "first",
      "prev",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "ellipsis",
      "20",
      "next",
      "last",
    ])
  })

  it("centers the window around the current page in the middle", () => {
    const { sequence } = renderPagination({ currentPage: 10, totalPages: 20 })
    expect(sequence()).toEqual([
      "first",
      "prev",
      "1",
      "ellipsis",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "ellipsis",
      "20",
      "next",
      "last",
    ])
  })

  it("clamps the window at the last page and shows a page instead of the second ellipsis", () => {
    for (const currentPage of [19, 20]) {
      const { sequence } = renderPagination({ currentPage, totalPages: 20 })
      expect(sequence()).toEqual([
        "first",
        "prev",
        "1",
        "ellipsis",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "next",
        "last",
      ])
    }
  })
})

describe("UltimatePagination behavior", () => {
  it("marks the current page as active", () => {
    const { container } = renderPagination({ currentPage: 10, totalPages: 20 })
    const active = container.querySelector("li.page-item.active")
    expect(active).toHaveTextContent("10(current)")
  })

  it("calls onChange with the clicked page number", async () => {
    const onChange = vi.fn()
    renderPagination({ currentPage: 10, totalPages: 20, onChange })
    await userEvent.click(screen.getByText("11"))
    expect(onChange).toHaveBeenCalledWith(11)
  })

  it("calls onChange with the next page number from the next link", async () => {
    const onChange = vi.fn()
    renderPagination({ currentPage: 10, totalPages: 20, onChange })
    await userEvent.click(
      screen.getByText("Next", { selector: "span.visually-hidden" }),
    )
    expect(onChange).toHaveBeenCalledWith(11)
  })
})
