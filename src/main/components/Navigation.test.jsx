import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { Navigation } from "./Navigation"

const datasources = [
  { id: 1, name: "Минпросвещения", url: "https://example.ru" },
  { id: 2, name: "Демоцентр", url: "https://demo.example.ru" },
]

const renderNav = (props = {}) =>
  render(
    <MemoryRouter>
      <Navigation
        datasources={datasources}
        isAuthenticated={false}
        email=""
        {...props}
      />
    </MemoryRouter>,
  )

describe("Navigation", () => {
  it("shows the brand with the current year", () => {
    renderNav()
    expect(
      screen.getByRole("link", {
        name: new RegExp(`ГИА ${new Date().getFullYear()} в Москве`),
      }),
    ).toHaveAttribute("href", "/")
  })

  it.each([
    ["Экзамены", "/exams"],
    ["Сотрудники", "/employees"],
    ["Организации", "/organisations"],
    ["ППЭ", "/places"],
    ["О сайте", "/about"],
  ])("links %s to %s", (name, to) => {
    renderNav()
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", to)
  })

  it("shows the login link when not authenticated", () => {
    renderNav()
    expect(screen.getByRole("link", { name: "Вход" })).toHaveAttribute("href", "/login")
  })

  it("shows the email dropdown with the user menu when authenticated", async () => {
    const user = userEvent.setup()
    renderNav({ isAuthenticated: true, email: "i@i.ru" })
    await user.click(screen.getByRole("button", { name: "i@i.ru" }))
    expect(screen.getByRole("link", { name: "Подписки" })).toHaveAttribute(
      "href",
      "/subscriptions",
    )
    expect(screen.getByRole("link", { name: "Настройки" })).toHaveAttribute(
      "href",
      "/settings",
    )
    expect(screen.getByRole("link", { name: "Выход" })).toHaveAttribute(
      "href",
      "/logout",
    )
  })

  it("lists the datasources as external links", async () => {
    const user = userEvent.setup()
    renderNav()
    await user.click(screen.getByRole("button", { name: "Источники" }))
    const link = screen.getByRole("link", { name: "Минпросвещения" })
    expect(link).toHaveAttribute("href", "https://example.ru")
    expect(link).toHaveAttribute("target", "_blank")
    expect(screen.getByRole("link", { name: "Демоцентр" })).toBeInTheDocument()
  })
})
