import logo from '../assets/logo.jpg'
import { NavLink , useNavigate } from 'react-router-dom'
import { useContext , useState} from 'react'
import AuthContext from './AuthContext'

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    toggleMenu();
    navigate('/'); 
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };
  
  return (
    <>
    <header className="primary-header">
      <img src={logo} alt="logo"/>
      <div className='nav_buttons_ham'>
        <button className={`hamburger-btn${isMenuOpen ? '-close' : ''}`} onClick={toggleMenu}>
          <span className="hamburger-icon">&#9776;</span> {/* ☰ */}
        </button>

        <div className={`nav_buttons${isMenuOpen ? '_close':''}`}>
          <nav className={`navs${isMenuOpen ? ' close' : ''}`}>
            <ul>
                <NavLink to={'/'} onClick={toggleMenu}><li>Home</li></NavLink>
                <NavLink to={'about'} onClick={toggleMenu}><li>About</li></NavLink>        
            </ul>
          </nav>
          <div className={`auth_buttons${
            isAuthenticated ? '_authenticated' : ''
          }`}>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" aria-label="Go to Profile" >
                  <button className='profile' onClick={toggleMenu}>Profile</button>
                </NavLink>
                <button onClick={handleLogout} aria-label="Logout">Logout</button>
              </>
            ) : (
              <NavLink to="/signup" aria-label="Create a new account" onClick={toggleMenu}>
                <button className="create-account-btn">Create Account</button>
              </NavLink>
            )}
          </div>
          
        </div>

      </div>
      
    </header>
    </>
  )
}

export default Header