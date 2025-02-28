import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './RecipeFolder/Recipe.module.css';

const RecipesByTag = () => {
  const { tag } = useParams();  // Get the tag from the URL
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipesByTag = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes-by-tag/${tag}`);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes by tag:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesByTag();
  }, [tag]);  // Re-run when the tag changes

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className={styles.recipes_by_tag}>
      <h1>Recipes with the tag: {tag}</h1>
      {recipes.length === 0 ? (
        <p>No recipes found with this tag.</p>
      ) : (
        <div className={styles.recipes_list}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.recipe_card}>
              <img src={recipe.image} alt={recipe.name} />
              <h2>{recipe.name}</h2>
              <p>Region: {recipe.region}</p>
              <p>Difficulty: {recipe.difficultyLevel}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesByTag;
