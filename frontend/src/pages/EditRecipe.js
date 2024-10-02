import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditRecipe.css'

function EditRecipe () {
	const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
		image: null,
		imagePreview: '',
        ingredients: [],
        steps: [],
		servings: '',
		diet: '',
		tags: []
    });

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
                const recipe = response.data;
                
                setFormData({
                    title: recipe.title,
					imagePreview: recipe.image,
                    ingredients: recipe.ingredients ? recipe.ingredients : [],
                    steps: recipe.steps ? recipe.steps : [''],
					servings: recipe.servings,
					diet: recipe.diet,
					tags: recipe.tags ? recipe.tags : [''],
                });
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };
        fetchRecipe();
    }, [id]);

	const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

	const handleFileChange = (e) => {
		console.log(e.target.files)
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

	const handleIngredientChange = (index, e) => {
        const updatedIngredients = formData.ingredients.map((ingredient, i) => 
			i === index ? e.target.value : ingredient
		);
        setFormData({
            ...formData,
            ingredients: updatedIngredients
        });
    };

	const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, '']
        });
    };

    const removeIngredient = (index) => {
        const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            ingredients: updatedIngredients
        });
    };

	const handleStepChange = (index, e) => {
        const updatedSteps = formData.steps.map((step, i) => i === index ? e.target.value : step);
        setFormData({
            ...formData,
            steps: updatedSteps
        });
    };

    const addStep = () => {
        setFormData({
            ...formData,
            steps: [...formData.steps, '']
        });
    };

    const removeStep = (index) => {
        const updatedSteps = formData.steps.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            steps: updatedSteps
        });
    };

	const handleTagChange = (index, e) => {
        const updatedTags = formData.tags.map((tag, i) => i === index ? e.target.value : tag);
        setFormData({
            ...formData,
            tags: updatedTags
        });
    };

    const addTag = () => {
        setFormData({
            ...formData,
            tags: [...formData.tags, '']
        });
    };

    const removeTag = (index) => {
        const updatedTags = formData.tags.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            tags: updatedTags
        });
    };

	const handleSubmit = async (e) => {
        e.preventDefault();

		const data = new FormData();
        data.append('title', formData.title);
        data.append('image', formData.image);
        data.append('ingredients', JSON.stringify(formData.ingredients));
        data.append('steps', JSON.stringify(formData.steps));
		data.append('servings', formData.servings);
		data.append('diet', formData.diet);
		data.append('tags', JSON.stringify(formData.tags));


        try {
            const response = await axios.put(`http://localhost:5001/api/recipes/${id}`, data, {
                headers: {
					'Content-Type': 'multipart/form-data',
                },
            });
			setFormData(response)
            alert('Recipe updated successfully');
            navigate(`/recipes/${id}`);
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('Failed to update recipe');
        }
    };

	return (
		<form onSubmit={handleSubmit} className="edit-recipe-form">
			<h2>Modifier la recette</h2>
			<div className="form-group">
				<label>Titre</label>
				<input
					type="text"
					name="title"
					value={formData.title}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="form-group">
				<label>Régime</label>
				<select name="diet" value={formData.diet || 'None'} onChange={handleChange}>
					<option value="">None</option>
					<option value="vegetarian">Végétarien</option>
					<option value="vegan">Vegan</option>
				</select>
			</div>
			<div className="form-group">
				<label>Image</label>
				{formData.imagePreview && (
					<div>
						<img src={`http://localhost:5001/uploads/${formData.imagePreview}`} alt="RecipeImage" style={{ width: '200px' }} />
					</div>
				)}
				<input
					type="file"
					name="image"
					onChange={handleFileChange}
				/>
			</div>
			<div className="form-group">
                <label>Tags</label>
				<div className="edit-recipe__tag-list">
					{formData.tags.map((tag, index) => (
						<div key={index} className="edit-recipe__tag-item">
							<input
								type="text"
								value={tag}
								onChange={(e) => handleTagChange(index, e)}
							/>
							<button type="button" onClick={() => removeTag(index)}>x</button>
						</div>
					))}
				</div>
			</div>
			<button type="button" onClick={addTag} className="edit-recipe__add-button">Ajouter un Tag</button>
			<div className="form-group">
	 			<label>Nombre de parts</label>
	 			<input
					type="number"
					name="servings"
					value={formData.servings}
					onChange={handleChange}
					required
				/>
			</div>
            <div className="form-group">
                <label>Ingrédients</label>
				<div className="edit-recipe__ingredient-list">
					{formData.ingredients.map((ingredient, index) => (
						<div key={index} className="edit-recipe__ingredient-item">
							<input
								type="text"
								value={ingredient}
								onChange={(e) => handleIngredientChange(index, e)}
								required
							/>
							<button type="button" onClick={() => removeIngredient(index)}>x</button>
						</div>
					))}
				</div>
			</div>
			<button type="button" onClick={addIngredient} className="edit-recipe__add-button">Ajouter un ingrédient</button>

			<div className="form-group">
                <label>Étapes</label>
				<div className="edit-recipe__step-list">
				{formData.steps.map((step, index) => (
					<div key={index} className="edit-recipe__step-item">
						<input
							type="text"
							value={step}
							onChange={(e) => handleStepChange(index, e)}
							required
						/>
						<button type="button" onClick={() => removeStep(index)}>x</button>
					</div>
				))}
				</div>
			</div>
			<button type="button" onClick={addStep} className="edit-recipe__add-button">Ajouter une étape</button>

			<button type="submit" className="submit-btn">Update Recipe</button>
		</form>
	);
}

export default EditRecipe