/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Recipe from './RecipeFolder/Recipe';
import axios from 'axios';
import styles from './RecipeDetail.module.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Store current user ID
  const [isOwner, setIsOwner] = useState(false);
  const [relatedRecipes, setRelatedRecipes] = useState([]); // Store related recipes

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes/${id}`);
        setRecipe(res.data);

        const token = localStorage.getItem('token');

        if (token) {
          // If user is logged in, fetch the user ID to check ownership
          const userRes = await axios.get('https://chef-server-ab7f1dad1bb4.herokuapp.com/api/get-user-id', {
            headers: {
              'x-auth-token': token,  // Get token from localStorage
            },
          });
          setCurrentUserId(userRes.data.userId);

          // Check if the logged-in user is the owner of the recipe
          if (res.data.userId === userRes.data.userId) {
            setIsOwner(true);
          }
        }

        // Fetch related recipes based on tags
        if (res.data.tags && res.data.tags.length > 0) {
          const tagRequests = res.data.tags.map((tag) =>
            axios.get(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes-by-tag/${tag}`)
          );
          const tagResponses = await Promise.all(tagRequests);
          const allRelatedRecipes = tagResponses.flatMap(response => response.data);
          
          // Filter out duplicates from the related recipes
          const uniqueRelatedRecipes = [
            ...new Map(allRelatedRecipes.map((recipe) => [recipe._id, recipe])).values(),
          ];

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
        headers: {
          'x-auth-token': localStorage.getItem('token'), // Add the auth token to headers for authorization
        },
      });
      navigate('/'); // Redirect to the list of recipes after deleting
    } catch (err) {
      setError('Error deleting recipe');
    }
  };

  const extractYouTubeId = (url) => {
    const youtubeRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/?(\w+)|(?:watch\?v=|embed\/)([a-zA-Z0-9_-]+)(?:[^\w\-_]*[a-zA-Z0-9_-]+)?))/;
    const matches = url.match(youtubeRegex);
    return matches ? matches[1] || matches[2] || matches[3] : null;
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;
  if (!recipe) return <h1>No Recipe Found</h1>;

  const cookingMethod = recipe.cookingMethod;

  const videoId = recipe.url ? extractYouTubeId(recipe.url) : null;

  return (
    <>
      <div>
      </div>
      <div className={styles.heading}>
        <h1>{recipe.name}</h1>
      </div>
      <div className={styles.img_details_container}>
        <div className={styles.img_container}>
          <img src={recipe.image} />
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
            <h3 className={styles.recipe_title}>Region: <span className={styles.recipe_value}>{recipe.region}</span></h3>
            <h3 className={styles.recipe_title}>Difficulty: <span className={styles.recipe_value}>{recipe.difficultyLevel}</span></h3>
            <h3 className={styles.recipe_title}>Serving Style: <span className={styles.recipe_value}>{recipe.servingStyle}</span></h3>
            <h3 className={styles.recipe_title}>Preparation Time: <span className={styles.recipe_value}>{recipe.prepTime} min</span></h3>
            <h3 className={styles.recipe_title}>Cooking Time: <span className={styles.recipe_value}>{recipe.cookTime} min</span></h3>
            <h3 className={styles.recipe_title}>Total Time: <span className={styles.recipe_value}>{recipe.totalTime} min</span></h3>
            <h3 className={styles.recipe_title}>Servings: <span className={styles.recipe_value}>{recipe.servings}</span></h3>
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

      <div className={styles.relatedRecipes}> 
        <h3 className={styles.heading}>Recommended Recipes:</h3>
        {relatedRecipes.length > 0 ? (
          <Recipe recipes={relatedRecipes} showRegion={false} group={false}/>
        ) : (
          <p>No related recipes found</p>
        )}
      </div>
    </>
  );
};

export default RecipeDetail;