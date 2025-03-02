import styles from './Recipe.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaShareAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Recipe = ({ recipes }) => {
  const [loading, setLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Fetch saved recipes when component mounts
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('https://chef-server-ab7f1dad1bb4.herokuapp.com/api/user-saved-recipes', {
          headers: {
            'x-auth-token': token,
          },
        });

        setSavedRecipes(response.data.map(recipe => recipe._id));  // Extract recipe IDs
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    fetchSavedRecipes();
  }, []);

  if (!recipes || recipes.length === 0) return <h1>No recipes found</h1>;

  // Group recipes by region
  const groupRecipesByRegion = () => {
    return recipes.reduce((groups, recipe) => {
      if (!groups[recipe.region]) {
        groups[recipe.region] = [];
      }
      groups[recipe.region].push(recipe);
      return groups;
    }, {});
  };

  const saveRecipe = async (recipeId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in first!');
        return;
      }

      const response = await axios.post(
        `https://chef-server-ab7f1dad1bb4.herokuapp.com/api/save-recipe/${recipeId}`,
        {},
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      if (response.status === 200) {
        alert('Recipe saved successfully!');
        setSavedRecipes((prev) => [...prev, recipeId]);  // Add to saved recipes list
      } else {
        alert(response.data.msg || 'Error saving recipe');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      if (error.response) {
        alert(error.response.data.msg || 'Something went wrong. Please try again.');
      } else {
        alert('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const unsaveRecipe = async (recipeId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in first!');
        return;
      }

      const response = await axios.post(
        `https://chef-server-ab7f1dad1bb4.herokuapp.com/api/unsave-recipe/${recipeId}`,
        {},
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      if (response.status === 200) {
        alert('Recipe unsaved successfully!');
        setSavedRecipes((prev) => prev.filter((id) => id !== recipeId));  // Remove from saved recipes list
      } else {
        alert(response.data.msg || 'Error unsaving recipe');
      }
    } catch (error) {
      console.error('Error unsaving recipe:', error);
      if (error.response) {
        alert(error.response.data.msg || 'Something went wrong. Please try again.');
      } else {
        alert('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (recipeId) => {
    const recipeUrl = `${window.location.origin}/recipe/${recipeId}`;

    if (navigator.share) {
      navigator.share({
        title: 'Check out this recipe!',
        url: recipeUrl,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(recipeUrl)
        .then(() => alert('Recipe link copied to clipboard!'))
        .catch((error) => console.log('Error copying to clipboard:', error));
    }
  };

  const groupedRecipes = groupRecipesByRegion();

  return (
    <div className={styles.recipe_container}>
      {Object.keys(groupedRecipes).map((region) => (
        <div key={region} className={styles.region_section}>
          <h1>{region}</h1>
          <div className={styles.region_cards}>
            {groupedRecipes[region].map((recipe) => (
              <div key={recipe._id} className={styles.recipe_card}>
                {/* Link wrapping the entire recipe card */}
                <Link to={`/recipe/${recipe._id}`} className={styles.recipe_link}>
                  <img src={recipe.image} alt={recipe.name} className={styles.recipe_img} />
                  <h2>{recipe.name}</h2>
                  <h3>Region: {recipe.region}</h3>
                  <p>Difficulty: {recipe.difficultyLevel}</p>
                </Link>

                {/* Separate links for the tags */}
                <div className={styles.recipe_tags}>
                  <p>Tags:</p>
                  {recipe.tags.map((ele, index) => (
                    <Link key={index} to={`/recipes-by-tag/${ele}`} className={styles.tag_link}>
                      {ele}
                    </Link>
                  ))}
                </div>

                <div className={styles.buttons_container}>
                  {savedRecipes.includes(recipe._id) ? (
                    <button
                      className={styles.unsave_button}
                      onClick={() => unsaveRecipe(recipe._id)}
                      disabled={loading}
                    >
                      {loading ? 'Unsaving...' : 'Unsave Recipe'}
                    </button>
                  ) : (
                    <button
                      className={styles.save_button}
                      onClick={() => saveRecipe(recipe._id)}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Recipe'}
                    </button>
                  )}
                  <button
                    className={styles.share_button}
                    onClick={() => handleShare(recipe._id)}
                  >
                    <FaShareAlt className={styles.share_icon} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

Recipe.propTypes = {
  recipes: PropTypes.array.isRequired,
};

export default Recipe;
