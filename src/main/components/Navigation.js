import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"

const AuthMenu = ({ isAuthenticated, email }) => (
  <Nav className="ms-auto">
    {isAuthenticated ? (
      <NavDropdown title={email} id="basic-nav-dropdown">
        <LinkContainer to="/subscriptions">
          <NavDropdown.Item>Подписки</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/settings">
          <NavDropdown.Item>Настройки</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/logout">
          <NavDropdown.Item>Выход</NavDropdown.Item>
        </LinkContainer>
      </NavDropdown>
    ) : (
      <LinkContainer to="/login">
        <Nav.Link>Вход</Nav.Link>
      </LinkContainer>
    )}
  </Nav>
)

export const Navigation = ({ datasources, isAuthenticated, email }) => (
  <Navbar bg="primary" data-bs-theme="dark" expand="md">
    <Container fluid>
      <Navbar.Brand href="/">ГИА {new Date().getFullYear()} в Москве</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="me-auto">
          <LinkContainer to="/exams">
            <Nav.Link>Экзамены</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/employees">
            <Nav.Link>Сотрудники</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/organisations">
            <Nav.Link>Организации</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/places">
            <Nav.Link>ППЭ</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about">
            <Nav.Link>О сайте</Nav.Link>
          </LinkContainer>
          <NavDropdown title="Источники" id="basic-nav-dropdown">
            {datasources.map((ds) => (
              <NavDropdown.Item
                key={ds.id}
                href={ds.url}
                target="_blank"
                rel="noopener noreferrer">
                {ds.name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </Nav>
        <AuthMenu isAuthenticated={isAuthenticated} email={email} />
      </Navbar.Collapse>
    </Container>
  </Navbar>
)

export default Navigation
