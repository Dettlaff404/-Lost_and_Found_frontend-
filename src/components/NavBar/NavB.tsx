import { useState } from 'react';
import styles from './navstyle.module.css';
import { useItemType } from "./ItemTypeContext";
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../Auth/AuthProvider';
import { FaBars, FaTimes, FaUser, FaSearch, FaList, FaSignOutAlt } from 'react-icons/fa';

function NavB() {
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isItemsDropdownOpen, setIsItemsDropdownOpen] = useState(false);

  const handleOnClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/');
    logout();
  }
  
  const { setSelectedItemType } = useItemType();
  
  const handleItemTypeClick = (itemType: string) => {
    setSelectedItemType(itemType);
    setIsMobileMenuOpen(false);
    setIsItemsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsItemsDropdownOpen(false);
  };

  const toggleItemsDropdown = () => {
    setIsItemsDropdownOpen(!isItemsDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsItemsDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <NavLink 
          to="/requests" 
          onClick={() => handleItemTypeClick("ALL")} 
          className={styles.navLogo}
        >
          Lost & Found Portal
        </NavLink>

        {/* Desktop Navigation */}
        <div className={styles.navMenu}>
          {!isAuthenticated ? (
            <div className={styles.navLinks}>
              <NavLink to="/signin" className={styles.navLink}>
                Sign In
              </NavLink>
              <NavLink to="/signup" className={`${styles.navLink} ${styles.navLinkPrimary}`}>
                Sign Up
              </NavLink>
            </div>
          ) : (
            <div className={styles.navLinks}>
              <NavLink 
                to="/requests" 
                onClick={() => handleItemTypeClick("ALL")}
                className={styles.navLink}
              >
                <FaSearch className={styles.navIcon} />
                Requests
              </NavLink>

              <div className={styles.dropdown}>
                <button 
                  className={styles.dropdownToggle}
                  onClick={toggleItemsDropdown}
                >
                  <FaList className={styles.navIcon} />
                  Items
                  <span className={`${styles.dropdownArrow} ${isItemsDropdownOpen ? styles.dropdownArrowOpen : ''}`}>
                    ▼
                  </span>
                </button>
                <div className={`${styles.dropdownMenu} ${isItemsDropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                  <NavLink 
                    to="/items" 
                    onClick={() => handleItemTypeClick("LOST")}
                    className={styles.dropdownItem}
                  >
                    Lost Items
                  </NavLink>
                  <NavLink 
                    to="/items" 
                    onClick={() => handleItemTypeClick("FOUND")}
                    className={styles.dropdownItem}
                  >
                    Found Items
                  </NavLink>
                  <NavLink 
                    to="/items" 
                    onClick={() => handleItemTypeClick("CLAIMED")}
                    className={styles.dropdownItem}
                  >
                    Claimed Items
                  </NavLink>
                </div>
              </div>

              <NavLink to="/users" className={styles.navLink}>
                <FaUser className={styles.navIcon} />
                Users
              </NavLink>

              <button onClick={handleOnClick} className={styles.logoutButton}>
                <FaSignOutAlt className={styles.navIcon} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <>
            <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}></div>
            <div className={`${styles.mobileMenu} ${styles.mobileMenuOpen}`}>
              <div className={styles.mobileMenuContent}>
                {!isAuthenticated ? (
                  <>
                    <NavLink 
                      to="/signin" 
                      className={styles.mobileNavLink}
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </NavLink>
                    <NavLink 
                      to="/signup" 
                      className={`${styles.mobileNavLink} ${styles.mobileNavLinkPrimary}`}
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink 
                      to="/requests" 
                      onClick={() => handleItemTypeClick("ALL")}
                      className={styles.mobileNavLink}
                    >
                      <FaSearch className={styles.mobileNavIcon} />
                      Requests
                    </NavLink>

                    <div className={styles.mobileDropdown}>
                      <button 
                        className={styles.mobileDropdownToggle}
                        onClick={toggleItemsDropdown}
                      >
                        <FaList className={styles.mobileNavIcon} />
                        Items
                        <span className={`${styles.mobileDropdownArrow} ${isItemsDropdownOpen ? styles.mobileDropdownArrowOpen : ''}`}>
                          ▼
                        </span>
                      </button>
                      <div className={`${styles.mobileDropdownMenu} ${isItemsDropdownOpen ? styles.mobileDropdownMenuOpen : ''}`}>
                        <NavLink 
                          to="/items" 
                          onClick={() => handleItemTypeClick("LOST")}
                          className={styles.mobileDropdownItem}
                        >
                          Lost Items
                        </NavLink>
                        <NavLink 
                          to="/items" 
                          onClick={() => handleItemTypeClick("FOUND")}
                          className={styles.mobileDropdownItem}
                        >
                          Found Items
                        </NavLink>
                        <NavLink 
                          to="/items" 
                          onClick={() => handleItemTypeClick("CLAIMED")}
                          className={styles.mobileDropdownItem}
                        >
                          Claimed Items
                        </NavLink>
                      </div>
                    </div>

                    <NavLink 
                      to="/users" 
                      className={styles.mobileNavLink}
                      onClick={closeMobileMenu}
                    >
                      <FaUser className={styles.mobileNavIcon} />
                      Users
                    </NavLink>

                    <button onClick={handleOnClick} className={styles.mobileLogoutButton}>
                      <FaSignOutAlt className={styles.mobileNavIcon} />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavB;