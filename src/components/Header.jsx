import logo from '../assets/logo.jpg'
import { NavLink , useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './AuthContext'

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };
  
  return (
    <header className="primary-header">
      <img src={logo} alt="logo"/>
      <nav>
        <ul>
            <NavLink to={'/'}><li>Home</li></NavLink>
            <NavLink to={'about'}><li>About</li></NavLink>        
        </ul>
      </nav>
      {isAuthenticated ? (
        <>
          <NavLink to="/profile" aria-label="Go to Profile">
            <button>Profile</button>
          </NavLink>
          <button onClick={handleLogout} aria-label="Logout">Logout</button>
        </>
      ) : (
        <NavLink to="/signup" aria-label="Create a new account">
          <button>Create Account</button>
        </NavLink>
      )}
    </header>
  )
}

export default Header