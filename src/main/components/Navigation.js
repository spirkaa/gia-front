import React from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

export const Navigation = ({ datasources }) => (
  <Navbar fluid inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to='/'>ГИА 2017 в Москве</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to='/exams'>
          <NavItem eventKey='1'>Экзамены</NavItem>
        </LinkContainer>
        <LinkContainer to='/employees'>
          <NavItem eventKey='2'>Сотрудники</NavItem>
        </LinkContainer>
        <LinkContainer to='/organisations'>
          <NavItem eventKey='3'>Организации</NavItem>
        </LinkContainer>
        <LinkContainer to='/places'>
          <NavItem eventKey='4'>ППЭ</NavItem>
        </LinkContainer>
        <LinkContainer to='/about'>
          <NavItem eventKey='5'>О сайте</NavItem>
        </LinkContainer>
      </Nav>
      <Nav pullRight>
        <NavDropdown eventKey='6' title='Источники' id='basic-nav-dropdown'>
          {datasources.map(
            ds => <MenuItem key={ds.id} eventKey={`6.${ds.id}`} href={ds.url} target='_blank'>{ds.name}</MenuItem>)}
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Navigation