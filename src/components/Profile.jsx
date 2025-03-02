/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Recipe from './RecipeFolder/Recipe';
import AuthContext from './AuthContext';

const Profile = () => {
  const { token } = useContext(AuthContext); 
  const [userRecipes, setUserRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching user added recipes
  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const res = await axios.get('https://chef-server-ab7f1dad1bb4.herokuapp.com/api/user-recipes', {
          headers: { 'x-auth-token': token }, // Use token from context
        });
        setUserRecipes(res.data);
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

  // Fetching saved recipes
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const res = await axios.get('https://chef-server-ab7f1dad1bb4.herokuapp.com/api/user-saved-recipes', {
          headers: { 'x-auth-token': token }, // Use token from context
        });
        setSavedRecipes(res.data);
      } catch (err) {
        setError('Error loading saved recipes');
      }
    };

    if (token) {  // Only fetch if token is available
      fetchSavedRecipes();
    }
  }, [token]);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <h1>Your Added Recipes</h1>
          {userRecipes.length === 0 ? (
            <h2>No recipes added yet</h2>
          ) : (
            <Recipe recipes={userRecipes} />
          )}

          {/* Section for Saved Recipes */}
          <h1>Your Saved Recipes</h1>
          {savedRecipes.length === 0 ? (
            <h2>No saved recipes yet</h2>
          ) : (
            <Recipe recipes={savedRecipes} />
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
