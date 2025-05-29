import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from './navstyle.module.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useItemType } from "./ItemTypeContext";
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from 'react-bootstrap';

function NavB() {

  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleOnClick = () => {
    logout();
    navigate('/signin');
  }
  
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
            {!isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/signin">SignIn</Nav.Link>
                <Nav.Link as={NavLink} to="/signup">SignUp</Nav.Link>
              </>
            ): (
              <>
                <Nav.Link as={NavLink} to="/requests" onClick={() => handleItemTypeClick("ALL")}>Requests</Nav.Link>

                <NavDropdown title="Items" id="basic-nav-dropdown">
                  <NavDropdown.Item className={styles.dropdown} as={NavLink} to="/items" onClick={() => handleItemTypeClick("LOST")}>Lost</NavDropdown.Item>
                  <NavDropdown.Item className={styles.dropdown} as={NavLink} to="/items" onClick={() => handleItemTypeClick("FOUND")}>Found</NavDropdown.Item>
                  <NavDropdown.Item className={styles.dropdown} as={NavLink} to="/items" onClick={() => handleItemTypeClick("CLAIMED")}>Claimed</NavDropdown.Item>
                </NavDropdown>

                <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
                <Button style={{marginLeft: "15px", border: "none"}} variant="warning" onClick={handleOnClick}>Logout</Button>
              </>
            )};
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavB;