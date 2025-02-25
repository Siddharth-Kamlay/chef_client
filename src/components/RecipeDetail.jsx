/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError('Error loading recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;
  if (!recipe) return <h1>No Recipe Found</h1>;

  return (
    <div >
      <h1>{recipe.name}</h1>
      <img
        src={`http://localhost:5000/${recipe.image}`}
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
    </div>
  );
};

export default RecipeDetail;
