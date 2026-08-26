import { render, screen } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { PasswordEmailSent } from "./PasswordEmailSent"

describe("PasswordEmailSent", () => {
  it("confirms the email was sent and links back home", () => {
    render(
      <MemoryRouter>
        <HelmetProvider>
          <PasswordEmailSent />
        </HelmetProvider>
      </MemoryRouter>,
    )
    expect(screen.getByText("Восстановление пароля")).toBeInTheDocument()
    expect(screen.getByText("Еще один шаг")).toBeInTheDocument()
    expect(
      screen.getByText(/Письмо для восстановления пароля отправлено/),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Вернуться на главную страницу" }),
    ).toHaveAttribute("href", "/")
  })
})
