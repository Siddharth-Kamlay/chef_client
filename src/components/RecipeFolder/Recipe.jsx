import styles from './Recipe.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaShareAlt, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';  // Import React Icons for stars
import { useState, useEffect } from 'react';
import api from '../../api/apiConfig';

const Recipe = ({ recipes, showRegion = true, group = true }) => {
  const [loading, setLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Fetch saved recipes when component mounts
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await api.get('/api/user-saved-recipes', {
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

      const response = await api.post(
        `/api/save-recipe/${recipeId}`,
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

      const response = await api.post(
        `/api/unsave-recipe/${recipeId}`,
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

  // Function to calculate average rating
  const calculateAverageRating = (ratings) => {
    // If ratings is a number, return it directly
    if (typeof ratings === 'number') {
      return ratings.toFixed(1); // Ensure 1 decimal place
    }

    // If ratings is an array, process the average
    if (Array.isArray(ratings) && ratings.length > 0) {
      const total = ratings.reduce((acc, rating) => {
        if (rating && typeof rating.rating === 'number') {
          return acc + rating.rating;
        }
        return acc; // Skip invalid ratings
      }, 0);

      return (total / ratings.length).toFixed(1);  // Round to 1 decimal place
    }

    // If ratings is neither a number nor a valid array, return 0
    return 0;
  };

  // Function to render stars based on average rating
  const renderStars = (averageRating) => {
    const fullStars = Math.floor(averageRating); // Number of full stars (e.g., 4 for 4.5)
    const halfStars = averageRating % 1 >= 0.5 ? 1 : 0; // If rating has a half-star (e.g., 4.5)

    let stars = [];
    
    // Full stars (filled)
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={styles.starIcon} />);
    }

    // Half star (half-filled)
    if (halfStars > 0) {
      stars.push(<FaStarHalfAlt key="half" className={styles.starIcon} />);
    }

    // Empty stars (optional - you can choose to omit them)
    const emptyStars = 5 - fullStars - halfStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={styles.starIcon} />);
    }

    return stars;
  };

  const groupedRecipes = group ? groupRecipesByRegion() : { recipes };

  return (
    <div className={styles.recipe_container}>
      {Object.keys(groupedRecipes).map((region) => (
        <div key={region} className={styles.region_section}>
          {showRegion && <h1>{region}</h1>}
          <div className={styles.region_cards}>
            {groupedRecipes[region].map((recipe) => (
              <div key={recipe._id} className={styles.recipe_card}>
                {/* Link wrapping the entire recipe card */}
                <Link to={`/recipe/${recipe._id}`} className={styles.recipe_link}>
                  <img src={recipe.image} alt={recipe.name} className={styles.recipe_img} />
                  <h2>{recipe.name}</h2>
                </Link>

                {/* Display the average rating as stars */}
                <div >
                  <p className={styles.recipe_rating}>Rating:&nbsp;{renderStars(calculateAverageRating(recipe.ratings))}</p>
                </div>

                {/* Tags Section */}
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
  showRegion: PropTypes.bool,
  group: PropTypes.bool,
};

export default Recipe;
