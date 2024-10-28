import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddRecipePage.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AddRecipe() {
	const [formData, setFormData] = useState({
		title: "",
		image: null,
		ingredients: [],
		steps: [],
		serving: 1,
		diet: "",
		tags: [],
	});

	const [ingredients, setIngredients] = useState("");
	const [step, setStep] = useState("");
	const [tag, setTag] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleFileChange = (e) => {
		setFormData({
			...formData,
			image: e.target.files[0],
		});
	};

	const handleKeyPress = (type, value, setValue) => (e) => {
		if (e.key === "Enter" && value.trim()) {
			e.preventDefault();
			setFormData({
				...formData,
				[type]: [...formData[type], value],
			});
			setValue("");
		}
	};

	const handleRemoveItem = (type, index) => {
		setFormData({
			...formData,
			[type]: formData[type].filter((_, i) => i !== index),
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append("title", formData.title);
		data.append("image", formData.image);
		data.append("servings", formData.serving);
		data.append("ingredients", JSON.stringify(formData.ingredients));
		data.append("steps", JSON.stringify(formData.steps));
		data.append("diet", formData.diet);
		data.append("tags", JSON.stringify(formData.tags));

		try {
			const response = await axios.post(
				`${BACKEND_URL}/api/recipes`,
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setFormData(response);
			alert("Recipe added");
			navigate(`/`);
		} catch (error) {
			console.error("Error adding recipe:", error);
			alert("Failed to add recipe");
		}
	};

	const reorderArray = (array, oldIndex, newIndex) => {
		const movedItem = array[oldIndex];
		const remainingItems = array.filter((_, index) => index !== oldIndex);

		const reorderedItems = [
			...remainingItems.slice(0, newIndex),
			movedItem,
			...remainingItems.slice(newIndex),
		];

		return reorderedItems;
	};

	const changeOrder = (type, index, direction) => {
		const items = formData[type];
		const newIndex = direction === "UP" ? index - 1 : index + 1;

		if (newIndex >= 0 && newIndex < items.length) {
			const reorderedItems = reorderArray(items, index, newIndex);
			setFormData({
				...formData,
				[type]: reorderedItems,
			});
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
				<select
					name="diet"
					value={formData.diet || "None"}
					onChange={handleChange}
				>
					<option value="">None</option>
					<option value="vegetarian">Végétarien</option>
					<option value="vegan">Vegan</option>
				</select>
			</div>
			<div className="form-group">
				<label>Image</label>
				<input type="file" name="image" onChange={handleFileChange} />
			</div>
			<div className="form-group">
				<label>Tags</label>
				<input
					type="text"
					value={tag}
					onChange={(e) => setTag(e.target.value)}
					onKeyPress={handleKeyPress("tags", tag, setTag)}
					placeholder="Ajouter un tag et appuyer sur Entrée"
				/>
				<div className="addrecipe__tag-list">
					{formData.tags.map((tagg, index) => (
						<li key={index} className="addrecipe__tag-item">
							{tagg}{" "}
							<div className="addrecipe__button-group">
								<button type="button" onClick={() => changeOrder("tags", index, "UP")}>
									⬆️
								</button>
								<button type="button" onClick={() => changeOrder("tags", index, "DOWN")}>
									⬇️
								</button>
								<button type="button" onClick={() => handleRemoveItem("tags", index)}>
									🗑️
								</button>
							</div>
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
					onKeyPress={handleKeyPress(
						"ingredients",
						ingredients,
						setIngredients
					)}
					placeholder="Ajouter un ingrédient et appuyer sur Entrée"
				/>
				<div className="addrecipe__ingredient-list">
					{formData.ingredients.map((ing, index) => (
						<li key={index} className="addrecipe__ingredient-item">
							{ing}{" "}
							<div className="addrecipe__button-group">
								<button type="button" onClick={() => changeOrder("ingredients", index, "UP")}>
									⬆️
								</button>
								<button type="button" onClick={() => changeOrder("ingredients", index, "DOWN")}>
									⬇️
								</button>
								<button type="button" onClick={() => handleRemoveItem("ingredients", index)}>
									🗑️
								</button>
							</div>
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
					onKeyPress={handleKeyPress("steps", step, setStep)}
					placeholder="Ajouter une étape et appuyer sur Entrée"
				/>
				<div className="addrecipe__step-list">
					{formData.steps.map((step, index) => (
						<li key={index} className="addrecipe__step-item">
							{step}{" "}
							<div className="addrecipe__button-group">
								<button type="button" onClick={() => changeOrder("steps", index, "UP")}>
									⬆️
								</button>
								<button type="button" onClick={() => changeOrder("steps", index, "DOWN")}>
									⬇️
								</button>
								<button type="button" onClick={() => handleRemoveItem("steps", index)}>
									🗑️
								</button>
							</div>
						</li>
					))}
				</div>
			</div>

			<button type="submit" className="addrecipe__submit-btn">
				Ajouter la recette
			</button>
		</form>
	);
}

export default AddRecipe;
