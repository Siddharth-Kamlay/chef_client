import styles from './Recipe.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Recipe = ({ recipes }) => {
  if (!recipes || recipes.length === 0) return <h1>No recipes found</h1>;

  return (
    <div className={styles.recipe_container}>
      {recipes.map(recipe => (
        <Link key={recipe._id} to={`/recipe/${recipe._id}`} className={styles.recipe_card}>
          <img src={`http://localhost:5000/${recipe.image}`} alt={recipe.name} className={styles.recipe_img} />
          <h2>{recipe.name}</h2>
          <br />
          <h3>Region: {recipe.region}</h3>
          <br />
          <div className={styles.recipe_tags}>
            <p style={{ fontWeight: 'bold' }}>Tags: </p>
            {recipe.tags.map((ele, index) => (
              <p key={index}>&nbsp;{ele}</p>
            ))}
          </div>
          <br />
          <p style={{ fontWeight: 'bold' }}>Difficulty: {recipe.difficultyLevel}</p>
        </Link>
      ))}
    </div>
  );
};

Recipe.propTypes = {
  recipes: PropTypes.array.isRequired, // Make sure recipes is an array and is required
};

export default Recipe;