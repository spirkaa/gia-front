import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Disclaimer } from "./Disclaimer"

describe("Disclaimer", () => {
  const renderDisclaimer = () => render(<Disclaimer />)

  it("shows the warning heading and the RCOI source link", () => {
    renderDisclaimer()
    expect(
      screen.getByRole("heading", { name: "Отказ от ответственности" }),
    ).toBeInTheDocument()
    const link = screen.getByRole("link", { name: /официальном сайте РЦОИ/ })
    expect(link).toHaveAttribute("href", "http://rcoi.mcko.ru/organizers/schedule/ege/")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("states the site is independent and for reference only", () => {
    renderDisclaimer()
    expect(screen.getByText(/не связан с РЦОИ города Москвы/)).toBeInTheDocument()
    expect(screen.getByText(/носит справочный характер/)).toBeInTheDocument()
    expect(screen.getByText(/не несет ответственности/)).toBeInTheDocument()
  })
})
