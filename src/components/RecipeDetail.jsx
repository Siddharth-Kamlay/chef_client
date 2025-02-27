/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Store current user ID
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes/${id}`);
        setRecipe(res.data);

        const userRes = await axios.get('https://chef-server-ab7f1dad1bb4.herokuapp.com/api/get-user-id', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),  // Get token from localStorage (or wherever it's stored)
          },
        });
        setCurrentUserId(userRes.data.userId);

        if (res.data.userId === userRes.data.userId) {
          setIsOwner(true);
        }
      } catch (err) {
        setError('Error loading recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'), // Add the auth token to headers for authorization
        },
      });
      navigate('/'); // Redirect to the list of recipes after deleting
    } catch (err) {
      setError('Error deleting recipe');
    }
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;
  if (!recipe) return <h1>No Recipe Found</h1>;

  return (
    <div >
      <h1>{recipe.name}</h1>
      <img
        src={recipe.image}
        alt={recipe.name}
      />
      <p><strong>Region:</strong> {recipe.region}</p>
      <p><strong>Difficulty:</strong> {recipe.difficultyLevel}</p>
      <p><strong>Cooking Method:</strong> {recipe.cookingMethod}</p>
      <p><strong>Serving Style:</strong> {recipe.servingStyle}</p>
      <p><strong>Preparation Time:</strong> {recipe.prepTime} min</p>
      <p><strong>Cooking Time:</strong> {recipe.cookTime} min</p>
      <p><strong>Total Time:</strong> {recipe.totalTime} min</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>

      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
        ))}
      </ul>

      <h3>Spices:</h3>
      <ul>
        {recipe.spices.map((spice, index) => (
          <li key={index}>{spice.name} - {spice.quantity} {spice.unit}</li>
        ))}
      </ul>
      {isOwner && (
        <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
          Delete Recipe
        </button>
      )}
    </div>
  );
};

export default RecipeDetail;
