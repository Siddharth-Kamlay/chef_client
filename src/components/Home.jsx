/* eslint-disable no-unused-vars */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Recipe from './RecipeFolder/Recipe';
import AuthContext from './AuthContext';
import { useContext } from 'react';
import styles from './Home.module.css'

const Home = () => {
  const inputRef = useRef(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('name');
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();

    // Fetch default recipes on page load
    const fetchDefaultRecipes = async () => {
      try {
        const res = await axios.get('https://chef-server-dusky.vercel.app/api/recipes');
        setRecipes(res.data);
      } catch (err) {
        setError('Error loading recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultRecipes();
  }, []);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = async () => {
    const inputValue = inputRef.current.value.trim();
  
    if (!inputValue) {
      setError(`Please enter a ${searchType === 'ingredients' ? 'ingredient' : 'recipe name'}`);
      return;
    }
  
    try {
      setLoading(true);
      const params = searchType === 'ingredients'
        ? { ingredients: inputValue.split(',').map(item => item.trim()).join(',') }
        : { name: inputValue };
  
      const res = await axios.get('https://chef-server-dusky.vercel.app/api/recipes', { params });
  
      if (res.data.length === 0) {
        setError('No recipes found. Please try again with different search criteria.');
      } else {
        setRecipes(res.data);
        setError(null); // Clear any previous error
      }
    } catch (error) {
      setError('Error fetching recipes. Please check your internet connection or try again later.');
    } finally {
      setLoading(false);
    }
  
    inputRef.current.value = ''; // Clear input field after search
  };
  
  const handleAddRecipe = () => {
    if (isAuthenticated) {
      navigate('/add-recipe'); // Go to Add Recipe page if logged in
    } else {
      navigate('/signup'); // Go to Signup page if not logged in
    }
  };

  return (
    <>
    <div className={styles.search_add}>
      <div>
        <label>
          <input
            type="radio"
            value="ingredients"
            checked={searchType === 'ingredients'}
            onChange={handleSearchTypeChange}
          />
          Search by Ingredients
        </label>
        <label>
          <input
            type="radio"
            value="name"
            checked={searchType === 'name'}
            onChange={handleSearchTypeChange}
          />
          Search by Recipe Name
        </label>
      </div>

      <div>
        <input ref={inputRef} placeholder={searchType === 'ingredients' ? 'Enter ingredients (comma separated)' : 'Enter recipe name'} type="text" />
        <button 
          onClick={handleSearch}
          style={{ marginTop: '20px', padding: '15px 50px', fontSize: '20px' }}>
            Find Recipes
        </button>
      </div>
    </div>

    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <Recipe recipes={recipes} />
      )}
      <button onClick={handleAddRecipe} className={styles.add_recipe}>
        Add Recipe
      </button>
    </div>
    </>
  );
};

export default Home;