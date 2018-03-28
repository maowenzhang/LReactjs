var React = require('react');
import {Navbar, NavItem, Nav, NavDropdown, MenuItem} from 'react-bootstrap';

export default class Header extends React.Component {
    render() {
        return (
            <Navbar inverse collapseOnSelect bsClass="navbar">
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="/">Giant Test</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                {/* <NavItem eventKey={1} href="#">
                    Link
                </NavItem> */}
                    {/* <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}>Action</MenuItem>
                    </NavDropdown> */}
                </Nav>
                <Nav pullRight>
                    <NavItem eventKey={2} href="#">
                        登陆
                    </NavItem>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        );
    }
}