import React from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

export const Navigation = () => (
  <Navbar fluid inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to='/'>ГИА 2017 в Москве</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to='/exams'>
          <NavItem eventKey={1}>Экзамены</NavItem>
        </LinkContainer>
        <LinkContainer to='/employees'>
          <NavItem eventKey={2}>Сотрудники</NavItem>
        </LinkContainer>
        <LinkContainer to='/organisations'>
          <NavItem eventKey={3}>Организации</NavItem>
        </LinkContainer>
        <LinkContainer to='/places'>
          <NavItem eventKey={3}>ППЭ</NavItem>
        </LinkContainer>
        <LinkContainer to='/about'>
          <NavItem eventKey={4}>О сайте</NavItem>
        </LinkContainer>
      </Nav>
      <Nav pullRight>
        <NavDropdown eventKey={4} title='Источники' id='basic-nav-dropdown'>
          <MenuItem eventKey={4.1}
                    href='http://rcoi.mcko.ru/index.php?option=com_content&view=article&id=1033&Itemid=211'
                    target='_blank'>Основной этап ГИА-9</MenuItem>
          <MenuItem eventKey={4.2}
                    href='http://rcoi.mcko.ru/index.php?option=com_content&view=article&id=898&Itemid=197'
                    target='_blank'>Основной этап ГИА-11</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Navigation