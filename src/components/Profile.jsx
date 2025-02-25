import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Recipe from './RecipeFolder/Recipe';
import AuthContext from './AuthContext';  

const Profile = () => {
  const { token } = useContext(AuthContext); 
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user-recipes', {
          headers: { 'x-auth-token': token }, // Use token from context
        });
        setUserRecipes(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Error loading user recipes');
      } finally {
        setLoading(false);
      }
    };

    if (token) {  // Only fetch if token is available
      fetchUserRecipes();
    }
  }, [token]);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : userRecipes.length === 0 ? (
        <h1>No recipes added yet</h1>
      ) : (
        <>
          <h1>Your Added Recipes</h1>
          <Recipe recipes={userRecipes} />
        </>
      )}
    </div>
  );
};


export default Profile;