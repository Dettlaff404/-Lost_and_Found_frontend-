import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from './navstyle.module.css';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavB() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home" className={styles.navbar_logo}>- Lost & Found Portal -</Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link href="#home">Requests</Nav.Link>

            <NavDropdown title="Items" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Lost</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Found</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Claimed</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#pricing">Users</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavB;