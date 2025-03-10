import { useContext, useState, useEffect } from 'react';
import logo from '../assets/logo.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // For mobile: false means hidden, true means visible.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // When switching to desktop, ensure the mobile menu state is reset
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle only applies for mobile view
  const toggleMenu = () => {
    if (isMobile) {
      setIsMenuOpen(prev => !prev);
    }
  };

  // When a link or button is clicked, close the menu on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    handleLinkClick(); // Close the menu when logging out
    navigate('/');
  };

  return (
    <header className="primary-header">
      <img src={logo} alt="logo" />
      <div className="nav_buttons_ham">
        <button
          className={`hamburger-btn${isMenuOpen ? '-close' : ''}`}
          onClick={toggleMenu}
        >
          <span className="hamburger-icon">
            {isMenuOpen ? '✕' : '\u2630'}
          </span>
        </button>

        {/* For mobile: if menu is closed, add _close class to hide it.
            For desktop, the menu is always visible. */}
        <div className={`nav_buttons${isMobile && !isMenuOpen ? '_close' : ''}`}>
          <nav className="navs">
            <ul>
              <NavLink to="/" onClick={handleLinkClick}>
                <li>Home</li>
              </NavLink>
              <NavLink to="/about" onClick={handleLinkClick}>
                <li>About</li>
              </NavLink>
            </ul>
          </nav>
          <div className={`auth_buttons${isAuthenticated ? '_authenticated' : ''}`}>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" aria-label="Go to Profile" onClick={handleLinkClick}>
                  <button className="profile">Profile</button>
                </NavLink>
                <button onClick={handleLogout} aria-label="Logout">
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/signup" aria-label="Create a new account" onClick={handleLinkClick}>
                <button className="create-account-btn">Create Account</button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
