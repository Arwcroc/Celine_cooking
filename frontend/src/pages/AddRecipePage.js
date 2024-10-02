import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AddRecipePage.css'

function AddRecipe() {
	const [formData, setFormData] = useState({
		title: '',
		image: null,
		ingredients: [],
		steps: [],
		serving: 1,
		diet: '',
		tags: []
	});

	const [ingredients, setIngredients] = useState('');
	const [step, setStep] = useState('');
	const [tag, setTag] = useState('');
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

	const handleIngredientKeyPress = (e) => {
        if (e.key === 'Enter' && ingredients.trim()) {
            e.preventDefault();
            setFormData({
                ...formData,
                ingredients: [...formData.ingredients, ingredients]
            });
            setIngredients('');
        }
    };

    const handleStepKeyPress = (e) => {
        if (e.key === 'Enter' && step.trim()) {
            e.preventDefault();
            setFormData({
                ...formData,
                steps: [...formData.steps, step]
            });
            setStep('');
        }
    };

	const handleTagKeyPress = (e) => {
		if (e.key === 'Enter' && tag.trim) {
			e.preventDefault();
            setFormData({
                ...formData,
                tags: [...formData.tags, tag]
            });
            setTag('');
		}
	};

	const removeIngredient = (index) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.filter((_, i) => i !== index)
        });
    };

    const removeStep = (index) => {
        setFormData({
            ...formData,
            steps: formData.steps.filter((_, i) => i !== index)
        });
    };
	
	const removeTag = (index) => {
		setFormData({
            ...formData,
            tags: formData.tags.filter((_, i) => i !== index)
        });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
        data.append('title', formData.title);
        data.append('image', formData.image);
		data.append('servings', formData.serving);
        data.append('ingredients', JSON.stringify(formData.ingredients));
        data.append('steps', JSON.stringify(formData.steps));
		data.append('diet', formData.diet);
		data.append('tags', JSON.stringify(formData.tags));
		
		try {
			const response = await axios.post('http://localhost:5001/api/recipes', data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setFormData(response)
            alert('Recipe added');
			navigate(`/`);
		} catch (error) {
			console.error('Error adding recipe:', error);
     		alert('Failed to add recipe');
		}
	};

    return (
        <form onSubmit={handleSubmit} className="add-recipe-form">
			<h2>Ajouter une nouvelle recette</h2>
            <div className="form-group">
                <label>Titre</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
					placeholder="Ajouter un nom à votre recette"
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
                <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                />
            </div>
			<div className="form-group">
				<label>Tags</label>
				<input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Ajouter un tag et appuyer sur Entrée"
                />
                <div className="addrecipe__tag-list">
                    {formData.tags.map((tagg, index) => (
                        <li key={index} className="addrecipe__tag-item">
                            {tagg} <button type="button" onClick={() => removeTag(index)}>x</button>
                        </li>
                    ))}
                </div>
            </div>
			<div className="form-group">
	 			<label>Nombre de parts</label>
	 			<input
					type="number"
					name="serving"
					onChange={handleChange}
					required
				/>
			</div>
            <div className="form-group">
                <label>Ingrédients</label>
                <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    onKeyPress={handleIngredientKeyPress}
                    placeholder="Ajouter un ingrédient et appuyer sur Entrée"
                />
                <div className="addrecipe__ingredient-list">
                    {formData.ingredients.map((ing, index) => (
                        <li key={index} className="addrecipe__ingredient-item">
                            {ing} <button type="button" onClick={() => removeIngredient(index)}>x</button>
                        </li>
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label>Étapes</label>
                <input
                    type="text"
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
                    onKeyPress={handleStepKeyPress}
                    placeholder="Ajouter une étape et appuyer sur Entrée"
                />
                <div className="addrecipe__step-list">
                    {formData.steps.map((step, index) => (
                        <li key={index} className="addrecipe__step-item">
                            {step} <button type="button" onClick={() => removeStep(index)}>x</button>
                        </li>
                    ))}
                </div>
            </div>

            <button type="submit" className="addrecipe__submit-btn">Ajouter la recette</button>
        </form>
    );
}

export default AddRecipe;