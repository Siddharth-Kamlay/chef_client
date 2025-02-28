import './App.css'
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import About from './components/About'
import RecipeDetail from './components/RecipeDetail'
import SignUp from './components/SignUp'
import Login from './components/Login'
import AddRecipe from './components/AddRecipe'
import Profile from './components/Profile'
import RecipesByTag from './components/RecipesByTag'
import { AuthProvider } from './components/AuthContext'
import { useContext } from 'react'
import AuthContext from './components/AuthContext'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types';

function App() {

  const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  
  PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  return (
    <>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='about' element={<About />}/>
          <Route path="recipe/:id" element={<RecipeDetail />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="/recipes-by-tag/:tag" element={<RecipesByTag />} />
          <Route path="add-recipe" element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
