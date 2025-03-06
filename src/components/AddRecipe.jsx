import { useState } from "react";
import axios from "axios";
import styles from "./AddRecipe.module.css"; // Import the CSS module

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    name: "",
    cookingMethod: "",
    region: "",
    difficultyLevel: "",
    servingStyle: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    category: "",
    tags: "",
    url: "",
  });

  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [spices, setSpices] = useState([{ name: "", quantity: "", unit: "" }]);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleSpiceChange = (index, field, value) => {
    const updatedSpices = [...spices];
    updatedSpices[index][field] = value;
    setSpices(updatedSpices);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const addSpice = () => {
    setSpices([...spices, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };
  
  const removeSpice = (index) => {
    const updatedSpices = spices.filter((_, i) => i !== index);
    setSpices(updatedSpices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

    if (!token) {
      setMessage("You need to be logged in to add a recipe.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("region", formData.region);
    formDataToSend.append("difficultyLevel", formData.difficultyLevel);
    formDataToSend.append("servingStyle", formData.servingStyle);
    formDataToSend.append("prepTime", formData.prepTime);
    formDataToSend.append("cookTime", formData.cookTime);
    formDataToSend.append("servings", formData.servings);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("tags", formData.tags);
    formDataToSend.append("url", formData.url);
    formDataToSend.append("cookingMethod", formData.cookingMethod);

    formDataToSend.append("image", image);

    ingredients.forEach((ingredient, index) => {
      formDataToSend.append(`ingredient[${index}][name]`, ingredient.name);
      formDataToSend.append(`ingredient[${index}][quantity]`, ingredient.quantity);
      formDataToSend.append(`ingredient[${index}][unit]`, ingredient.unit);
    });

    spices.forEach((spice, index) => {
      formDataToSend.append(`spice[${index}][name]`, spice.name);
      formDataToSend.append(`spice[${index}][quantity]`, spice.quantity);
      formDataToSend.append(`spice[${index}][unit]`, spice.unit);
    });

    try {
      console.log([...formDataToSend.entries()]);
      const response = await axios.post("https://chef-server-ab7f1dad1bb4.herokuapp.com/api/add-recipes", formDataToSend, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.msg);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Error adding recipe.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Add Recipe</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input className={styles.inputField} type="text" name="name" placeholder="Recipe Name" onChange={handleChange} required />
        <input className={styles.inputField} type="text" name="region" placeholder="Region" onChange={handleChange} required />
        <input className={styles.inputField} type="text" name="difficultyLevel" placeholder="Difficulty Level" onChange={handleChange} required />
        <input className={styles.inputField} type="text" name="servingStyle" placeholder="Serving Style" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="prepTime" placeholder="Preparation Time" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="cookTime" placeholder="Cooking Time" onChange={handleChange} required />
        <input className={styles.inputField} type="number" name="servings" placeholder="Servings" onChange={handleChange} required />
        <input className={styles.inputField} type="text" name="category" placeholder="Category" onChange={handleChange} required />
        <input className={styles.inputField} type="text" name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} required />
        <input className={styles.inputField} type="text" name="url" placeholder="YouTube Video URL (optional)" onChange={handleChange} />
        <textarea className={styles.textareaField} name="cookingMethod" placeholder="Cooking Method" onChange={handleChange} value={formData.cookingMethod} required />

        <h3 className={styles.sectionTitle}>Ingredients</h3>
        {ingredients.map((ingredient, index) => (
          <div key={index} className={styles.inputWrapper}>
            <input className={styles.inputField} type="text" placeholder="Name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, "name", e.target.value)} required />
            <input className={styles.inputField} type="text" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)} required />
            <input className={styles.inputField} type="text" placeholder="Unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, "unit", e.target.value)} required />
            <button className={styles.removeButton} type="button" onClick={() => removeIngredient(index)} disabled={ingredients.length <= 1}>Remove</button>
          </div>
        ))}
        <button className={styles.inputField} type="button" onClick={addIngredient}>Add Ingredient</button>

        <h3 className={styles.sectionTitle}>Spices</h3>
        {spices.map((spice, index) => (
          <div key={index} className={styles.inputWrapper}>
            <input className={styles.inputField} type="text" placeholder="Name" value={spice.name} onChange={(e) => handleSpiceChange(index, "name", e.target.value)} required />
            <input className={styles.inputField} type="text" placeholder="Quantity" value={spice.quantity} onChange={(e) => handleSpiceChange(index, "quantity", e.target.value)} required />
            <input className={styles.inputField} type="text" placeholder="Unit" value={spice.unit} onChange={(e) => handleSpiceChange(index, "unit", e.target.value)} required />
            <button className={styles.removeButton} type="button" onClick={() => removeSpice(index)} disabled={spices.length <= 1}>Remove</button>
          </div>
        ))}
        <button className={styles.inputField} type="button" onClick={addSpice}>Add Spice</button>

        <h3 className={styles.sectionTitle}>Upload Image</h3>
        <input className={styles.inputField} type="file" accept="image/*" onChange={handleImageChange} required />

        <button className={styles.inputField} type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
