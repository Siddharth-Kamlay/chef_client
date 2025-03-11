import { useState } from "react";
import axios from "axios";
import styles from "./AddRecipe.module.css"; // Import the CSS module
import CreatableSelect from "react-select/creatable";

const regionOptions = [
  { value: "North Indian", label: "North Indian" },
  { value: "South Indian", label: "South Indian" },
  { value: "Italian", label: "Italian" },
  { value: "Chinese", label: "Chinese" },
  { value: "French", label: "French" },
  { value: "Mexican", label: "Mexican" },
];

const predefinedIngredientsMapping = {
  "Italian": [
    { name: "Olive Oil", quantity: "", unit: "tbsp" },
    { name: "Tomatoes", quantity: "", unit: "large" },
    { name: "Garlic", quantity: "", unit: "cloves" },
    { name: "Mozzarella Cheese", quantity: "", unit: "grams" },
    { name: "Pasta", quantity: "", unit: "grams" }
  ],
  "Chinese": [
    { name: "Soy Sauce", quantity: "", unit: "tbsp" },
    { name: "Rice", quantity: "", unit: "cup" },
    { name: "Chicken Breast", quantity: "", unit: "grams" },
    { name: "Ginger", quantity: "", unit: "tsp" },
    { name: "Green Onion", quantity: "", unit: "stalks" }
  ],
  "French": [
    { name: "Butter", quantity: "", unit: "tbsp" },
    { name: "Cream", quantity: "", unit: "cup" },
    { name: "Eggs", quantity: "", unit: "large" },
    { name: "Flour", quantity: "", unit: "cup" },
    { name: "Cheese (Gruyère)", quantity: "", unit: "grams" }
  ],
  "North Indian": [
    { name: "Basmati Rice", quantity: "", unit: "cup" },
    { name: "Yogurt", quantity: "", unit: "cup" },
    { name: "Onion", quantity: "", unit: "medium" },
    { name: "Tomato", quantity: "", unit: "large" },
    { name: "Chicken Breast", quantity: "", unit: "grams" }
  ],
  "South Indian": [
    { name: "Rice", quantity: "", unit: "cup" },
    { name: "Coconut", quantity: "", unit: "cup" },
    { name: "Lentils (Toor Dal or Urad Dal)", quantity: "", unit: "cup" },
    { name: "Mustard Seeds", quantity: "", unit: "tsp" },
    { name: "Tamarind", quantity: "", unit: "tbsp" }
  ],
  "Mexican": [
    { name: "Tortillas", quantity: "", unit: "large" },
    { name: "Beans (Black or Pinto)", quantity: "", unit: "can" },
    { name: "Avocado", quantity: "", unit: "medium" },
    { name: "Cheese (Cheddar or Cotija)", quantity: "", unit: "grams" },
    { name: "Lime", quantity: "", unit: "medium" }
  ]
};

const predefinedSpicesMapping = {
  Italian: [
    { name: "Oregano", quantity: "", unit: "tsp" },
    { name: "Basil", quantity: "", unit: "tsp" },
    { name: "Rosemary", quantity: "", unit: "tsp" }
  ],
  Chinese: [
    { name: "Five-Spice Powder", quantity: "", unit: "tsp" },
    { name: "Sichuan Peppercorns", quantity: "", unit: "tsp" },
    { name: "Star Anise", quantity: "", unit: "pcs" }
  ],
  French: [
    { name: "Herbes de Provence", quantity: "", unit: "tsp" },
    { name: "Nutmeg", quantity: "", unit: "tsp" },
    { name: "Bay Leaf", quantity: "", unit: "pcs" }
  ],
  "North Indian": [
    { name: "Garam Masala", quantity: "", unit: "tsp" },
    { name: "Coriander Powder", quantity: "", unit: "tsp" },
    { name: "Cumin Powder", quantity: "", unit: "tsp" }
  ],
  "South Indian": [
    { name: "Curry Powder", quantity: "", unit: "tsp" },
    { name: "Red Chili Powder", quantity: "", unit: "tsp" },
    { name: "Black Pepper", quantity: "", unit: "tsp" }
  ],
  Mexican: [
    { name: "Cumin", quantity: "", unit: "tsp" },
    { name: "Chili Powder", quantity: "", unit: "tsp" },
    { name: "Paprika", quantity: "", unit: "tsp" }
  ]
};

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    name: "",
    cookingMethod: "",
    region: "",
    cookTime: "",
    servings: "",
    tags: "",
    url: "",
  });

  // New state to track selected region option
  const [selectedRegion, setSelectedRegion] = useState(null);
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

  const handleRegionChange = (newValue) => {
    setSelectedRegion(newValue);
    const regionValue = newValue ? newValue.value : "";
    setFormData({ ...formData, region: regionValue });
    // If there are predefined ingredients for the selected region, update the ingredients.
    if (predefinedIngredientsMapping[regionValue]) {
      setIngredients(predefinedIngredientsMapping[regionValue]);
    }
    if (predefinedSpicesMapping[regionValue]) {
      setSpices(predefinedSpicesMapping[regionValue]);
    }
    else {
      // If not, allow manual input.
      setIngredients([{ name: "", quantity: "", unit: "" }]);
      setSpices([{ name: "", quantity: "", unit: "" }]);
    }
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
    formDataToSend.append("cookTime", formData.cookTime);
    formDataToSend.append("servings", formData.servings);
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
        <div className={styles.intialInfo}>
          <input className={styles.inputField} type="text" name="name" placeholder="Recipe Name" onChange={handleChange} required />
          <div className={styles.createSelect}>
            <CreatableSelect
              value={selectedRegion}
              onChange={handleRegionChange}
              options={regionOptions}
              placeholder="Select or type region"
              isClearable
              styles={{
                container: (provided) => ({
                  ...provided,
                  position: 'relative',
                  boxSizing: 'content-box',
                  width:'100%'
                }),
              }}
            />
          </div>

          <input className={styles.inputField} type="number" name="cookTime" placeholder="Cooking Time" onChange={handleChange} required />
          <input className={styles.inputField} type="number" name="servings" placeholder="Servings" onChange={handleChange} required />
          <input className={styles.inputField} type="text" name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} required />
          <input className={styles.inputField} type="text" name="url" placeholder="YouTube Video URL (optional)" onChange={handleChange} />

        </div>
        <div className={styles.textArea}>
          <textarea className={styles.textareaField} name="cookingMethod" placeholder="Cooking Method" onChange={handleChange} value={formData.cookingMethod} required />
        </div>

        <h3 className={styles.sectionTitle}>Ingredients</h3>
        {ingredients.map((ingredient, index) => (
          <div key={index} className={styles.inputWrapper}>
            <input className={styles.inputField} type="text" placeholder="Name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, "name", e.target.value)} required />
            <div className={styles.inputOther}>
              <input className={styles.inputField} type="text" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)} required />
              <input className={styles.inputField} type="text" placeholder="Unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, "unit", e.target.value)} required />
              <button className={styles.removeButton} type="button" onClick={() => removeIngredient(index)} disabled={ingredients.length <= 1}>Remove</button>
            </div>
          </div>
        ))}
        <button className={styles.inputFieldButton} type="button" onClick={addIngredient}>Add Ingredient</button>

        <h3 className={styles.sectionTitle}>Spices</h3>
        {spices.map((spice, index) => (
          <div key={index} className={styles.inputWrapper}>
            <input className={styles.inputField} type="text" placeholder="Name" value={spice.name} onChange={(e) => handleSpiceChange(index, "name", e.target.value)} required />
            <div className={styles.inputOther}>
              <input className={styles.inputField} type="text" placeholder="Quantity" value={spice.quantity} onChange={(e) => handleSpiceChange(index, "quantity", e.target.value)} required />
              <input className={styles.inputField} type="text" placeholder="Unit" value={spice.unit} onChange={(e) => handleSpiceChange(index, "unit", e.target.value)} required />
              <button className={styles.removeButton} type="button" onClick={() => removeSpice(index)} disabled={spices.length <= 1}>Remove</button>
            </div>
          </div>
        ))}
        <button className={styles.inputFieldButton} type="button" onClick={addSpice}>Add Spice</button>

        <h3 className={styles.sectionTitle}>Upload Image</h3>
        <div className={styles.image}>
          <input className={styles.inputField} type="file" accept="image/*" onChange={handleImageChange} required />
          <button className={styles.inputFieldButton} type="submit">Submit Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
