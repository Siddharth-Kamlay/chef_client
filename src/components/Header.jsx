import logo from '../assets/logo.jpg'
import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './AuthContext'

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
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
        <NavLink to="/profile" aria-label="Go to Profile">
          <button>Profile</button>
        </NavLink>
      ) : (
        <NavLink to="/signup" aria-label="Create a new account">
          <button>Create Account</button>
        </NavLink>
      )}
    </header>
  )
}

export default Header