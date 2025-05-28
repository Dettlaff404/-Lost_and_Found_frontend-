import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from './navstyle.module.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useItemType } from "./ItemTypeContext";
import { NavLink } from 'react-router';

function NavB() {
  
  const { setSelectedItemType } = useItemType();
  
  const handleItemTypeClick = (itemType: string) => {
    // console.log("Updating itemType to:", itemType);
    setSelectedItemType(itemType);
  };

  

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={NavLink} to="/requests" onClick={() => handleItemTypeClick("ALL")} className={styles.navbar_logo}>- Lost & Found Portal -</Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link as={NavLink} to="/requests" onClick={() => handleItemTypeClick("ALL")}>Requests</Nav.Link>

            <NavDropdown title="Items" id="basic-nav-dropdown">
              <NavDropdown.Item className={styles.dropdown} as={NavLink} to="/items" onClick={() => handleItemTypeClick("LOST")}>Lost</NavDropdown.Item>
              <NavDropdown.Item className={styles.dropdown} as={NavLink} to="/items" onClick={() => handleItemTypeClick("FOUND")}>Found</NavDropdown.Item>
              <NavDropdown.Item className={styles.dropdown} as={NavLink} to="/items" onClick={() => handleItemTypeClick("CLAIMED")}>Claimed</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavB;