import React from "react"
import { Link } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap"

const AuthMenu = ({ isAuthenticated, email }) => (
  <Nav pullRight>
    {isAuthenticated ? (
      <NavDropdown eventKey="7" title={email} id="basic-nav-dropdown">
        <LinkContainer to="/subscriptions">
          <MenuItem eventKey="7.1">Подписки</MenuItem>
        </LinkContainer>
        <LinkContainer to="/settings">
          <MenuItem eventKey="7.2">Настройки</MenuItem>
        </LinkContainer>
        <LinkContainer to="/logout">
          <MenuItem eventKey="7.3">Выход</MenuItem>
        </LinkContainer>
      </NavDropdown>
    ) : (
      <LinkContainer to="/login">
        <NavItem eventKey="7">Вход</NavItem>
      </LinkContainer>
    )}
  </Nav>
)

export const Navigation = ({ datasources, isAuthenticated, email }) => (
  <Navbar fluid inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">ГИА 2021 в Москве</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to="/exams">
          <NavItem eventKey="1">Экзамены</NavItem>
        </LinkContainer>
        <LinkContainer to="/employees">
          <NavItem eventKey="2">Сотрудники</NavItem>
        </LinkContainer>
        <LinkContainer to="/organisations">
          <NavItem eventKey="3">Организации</NavItem>
        </LinkContainer>
        <LinkContainer to="/places">
          <NavItem eventKey="4">ППЭ</NavItem>
        </LinkContainer>
        <LinkContainer to="/about">
          <NavItem eventKey="5">О сайте</NavItem>
        </LinkContainer>
        <NavDropdown eventKey="6" title="Источники" id="basic-nav-dropdown">
          {datasources.map((ds) => (
            <MenuItem
              key={ds.id}
              eventKey={`6.${ds.id}`}
              href={ds.url}
              target="_blank"
              rel="noopener noreferrer">
              {ds.name}
            </MenuItem>
          ))}
        </NavDropdown>
      </Nav>
      <AuthMenu isAuthenticated={isAuthenticated} email={email} />
    </Navbar.Collapse>
  </Navbar>
)

export default Navigation
