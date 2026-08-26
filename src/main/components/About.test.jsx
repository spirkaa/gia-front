import { render, screen } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { describe, expect, it } from "vitest"

import { About } from "./About"

const renderAbout = () =>
  render(
    <HelmetProvider>
      <About />
    </HelmetProvider>,
  )

describe("About", () => {
  it("shows the «О сайте» heading and the project history intro", () => {
    renderAbout()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("О сайте")
    expect(screen.getByText(/Сайт разрабатывается с 2016 года/)).toBeInTheDocument()
  })

  it("lists the client technologies", () => {
    renderAbout()
    expect(
      screen.getByRole("heading", { level: 4, name: "Клиент на JavaScript" }),
    ).toBeInTheDocument()
    ;["React", "Redux", "Bootstrap"].forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it("lists the server technologies with the API link", () => {
    renderAbout()
    expect(screen.getByRole("link", { name: "Сервер на Python" })).toHaveAttribute(
      "href",
      "https://gia-api.devmem.ru",
    )
    expect(screen.getByText("Django, Django REST Framework")).toBeInTheDocument()
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument()
    expect(screen.getByText("Redis")).toBeInTheDocument()
  })

  it("lists the CI/CD stack and the changelog", () => {
    renderAbout()
    expect(screen.getByRole("heading", { level: 4, name: "CI/CD" })).toBeInTheDocument()
    ;["Gitea", "Jenkins", "Kubernetes", "ArgoCD", "Helm"].forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
    expect(screen.getByText("Последние изменения")).toBeInTheDocument()
    expect(screen.getByText(/v2.14.0/)).toBeInTheDocument()
  })
})
