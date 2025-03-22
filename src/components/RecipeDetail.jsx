/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Recipe from './RecipeFolder/Recipe';
import axios from 'axios';
import styles from './RecipeDetail.module.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  
  // Rating states
  const [rating, setRating] = useState(0); // Selected rating (in 0.5 increments)
  const [hoverRating, setHoverRating] = useState(0); // Rating on hover
  const [ratingMessage, setRatingMessage] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes/${id}`);
        setRecipe(res.data);

        const token = localStorage.getItem('token');
        if (token) {
          const userRes = await axios.get('https://chef-server-ab7f1dad1bb4.herokuapp.com/api/get-user-id', {
            headers: { 'x-auth-token': token },
          });
          setCurrentUserId(userRes.data.userId);
          if (res.data.userId === userRes.data.userId) {
            setIsOwner(true);
          }

          // Fetch user-rated recipes and check if the user has rated the current recipe
          const ratedRecipesRes = await axios.get('https://chef-server-ab7f1dad1bb4.herokuapp.com/api/user-rated-recipes', {
            headers: { 'x-auth-token': token },
          });
          const userRatedRecipe = ratedRecipesRes.data.find(r => r.recipeName === res.data.name);
          if (userRatedRecipe) {
            setRating(userRatedRecipe.rating);
          }
        }

        if (res.data.tags && res.data.tags.length > 0) {
          const tagRequests = res.data.tags.map((tag) =>
            axios.get(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes-by-tag/${tag}`)
          );
          const tagResponses = await Promise.all(tagRequests);
          const allRelatedRecipes = tagResponses.flatMap(response => response.data);
          const uniqueRelatedRecipes = [
            ...new Map(allRelatedRecipes.map((recipe) => [recipe._id, recipe])).values(),
          ].filter(recipe => recipe._id !== res.data._id);
          setRelatedRecipes(uniqueRelatedRecipes);
        }

      } catch (err) {
        setError('Error loading recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      navigate('/');
    } catch (err) {
      setError('Error deleting recipe');
    }
  };

  const extractYouTubeId = (url) => {
    const youtubeRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/?(\w+)|(?:watch\?v=|embed\/)([a-zA-Z0-9_-]+)(?:[^\w\-_]*[a-zA-Z0-9_-]+)?))/;
    const matches = url.match(youtubeRegex);
    return matches ? matches[1] || matches[2] || matches[3] : null;
  };

  // Handler for submitting a rating
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setRatingMessage("You need to be logged in to rate.");
      return;
    }
    try {
      const res = await axios.post(
        `https://chef-server-ab7f1dad1bb4.herokuapp.com/api/rate-recipe/${id}`,
        { rating },
        { headers: { 'x-auth-token': token } }
      );
      setRatingMessage(res.data.msg);
      setRecipe({ ...recipe, averageRating: res.data.averageRating });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setRatingMessage(err.response.data.msg);
      } else {
        setRatingMessage('Error rating recipe');
      }
    }
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;
  if (!recipe) return <h1>No Recipe Found</h1>;

  const cookingMethod = recipe.cookingMethod;
  const videoId = recipe.url ? extractYouTubeId(recipe.url) : null;
  // Use hoverRating if available; otherwise use rating.
  const currentValue = hoverRating || rating;

  // Function to render star based on the current rating value.
  const renderStarIcon = (starIndex) => {
    if (currentValue >= starIndex) {
      return <FaStar color="#ffc107" size={30} />;
    } else if (currentValue >= starIndex - 0.5) {
      return <FaStarHalfAlt color="#ffc107" size={30} />;
    } else {
      return <FaRegStar color="#e4e5e9" size={30} />;
    }
  };

  return (
    <>
      <div className={styles.heading}>
        <h1>{recipe.name}</h1>
      </div>
      <div className={styles.img_details_container}>
        <div className={styles.img_container}>
          <img src={recipe.image} alt={recipe.name} />
        </div>
        <div className={styles.details_container}>
          <div className={styles.array_container}>
            <h3>Ingredients:</h3>
            <p>
              {recipe.ingredients.map((ingredient, index) => (
                <span key={index}>
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  {index < recipe.ingredients.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <h3>Spices:</h3>
            <p>
              {recipe.spices.map((spice, index) => (
                <span key={index}>
                  {spice.name} - {spice.quantity} {spice.unit}
                  {index < recipe.spices.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </div>
          <div className={styles.recipe_info}>
            <h3 className={styles.recipe_title}>
              Region: <span className={styles.recipe_value}>{recipe.region}</span>
            </h3>
            <h3 className={styles.recipe_title}>
              Cooking Time: <span className={styles.recipe_value}>{recipe.cookTime} min</span>
            </h3>
            <h3 className={styles.recipe_title}>
              Servings: <span className={styles.recipe_value}>{recipe.servings}</span>
            </h3>
          </div>
        </div>
      </div>
      <div className={styles.method_url_container}>
        <div className={styles.cooking_method}>
          <h3>Cooking Method</h3>
          {cookingMethod.split("\n").map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>
        <div className={styles.url}>
          {videoId && (
            <div className={styles.url_name_frame}>
              <h3>Watch Recipe Video</h3>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>

      <div>
        {isOwner && (
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete Recipe
          </button>
        )}
      </div>

      {/* Star Rating Form */}
      <div className={styles.ratingForm}>
        <h3>Rate this Recipe</h3>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {[1, 2, 3, 4, 5].map((star, index) => (
            <div
              key={index}
              style={{ display: 'inline-block', position: 'relative', width: 30, height: 30 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const relativeX = e.clientX - rect.left;
                // If pointer is in the left half, preview half star; otherwise full star.
                if (relativeX < rect.width / 2) {
                  setHoverRating(star - 0.5);
                } else {
                  setHoverRating(star);
                }
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const relativeX = e.clientX - rect.left;
                if (relativeX < rect.width / 2) {
                  setRating(star - 0.5);
                } else {
                  setRating(star);
                }
              }}
              onMouseLeave={() => setHoverRating(0)}
            >
              {renderStarIcon(star)}
            </div>
          ))}
        </div>
        <button className={styles.submitRating} onClick={handleRatingSubmit}>Submit Rating</button>
        {ratingMessage && <p>{ratingMessage}</p>}
      </div>

      <div className={styles.relatedRecipes}>
        <h3 className={styles.heading}>Recommended Recipes:</h3>
        {relatedRecipes.length > 0 ? (
          <Recipe recipes={relatedRecipes} showRegion={false} group={false} />
        ) : (
          <p>No related recipes found</p>
        )}
      </div>
    </>
  );
};

export default RecipeDetail;
