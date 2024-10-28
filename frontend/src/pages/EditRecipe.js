import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditRecipe.css";
import { BACKEND_URL } from '../config.js'

function EditRecipe() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: "",
		image: null,
		imagePreview: "",
		ingredients: [],
		steps: [],
		servings: "",
		diet: "",
		tags: [],
	});

	useEffect(() => {
		const fetchRecipe = async () => {
			try {
				const response = await axios.get(
					`${BACKEND_URL}/api/recipes/${id}`
				);
				const recipe = response.data;

				setFormData({
					title: recipe.title,
					imagePreview: recipe.image,
					ingredients: recipe.ingredients ? recipe.ingredients : [],
					steps: recipe.steps ? recipe.steps : [""],
					servings: recipe.servings,
					diet: recipe.diet,
					tags: recipe.tags ? recipe.tags : [""],
				});
			} catch (error) {
				console.error("Error fetching recipe:", error);
			}
		};
		fetchRecipe();
	}, [id]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleFileChange = (e) => {
		console.log(e.target.files);
		setFormData({
			...formData,
			image: e.target.files[0],
		});
	};

	const handleItemChange = (type, index, e) => {
		const updatedItem = formData[type].map((j, i) =>
			i === index ? e.target.value : j
		);
		setFormData({
			...formData,
			[type]: updatedItem,
		});
	};

	const handleAddItem = (type) => {
		setFormData({
			...formData,
			[type]: [...formData[type], ""],
		});
	};

	const handleRemoveItem = (type, index) => {
		const updatedItems = formData[type].filter((_, i) => i !== index);
		setFormData({
			...formData,
			[type]: updatedItems,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append("title", formData.title);
		data.append("image", formData.image);
		data.append("ingredients", JSON.stringify(formData.ingredients));
		data.append("steps", JSON.stringify(formData.steps));
		data.append("servings", formData.servings);
		data.append("diet", formData.diet);
		data.append("tags", JSON.stringify(formData.tags));

		try {
			const response = await axios.put(
				`${BACKEND_URL}/api/recipes/${id}`,
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setFormData(response);
			alert("Recipe updated successfully");
			navigate(`/recipes/${id}`);
		} catch (error) {
			console.error("Error updating recipe:", error);
			alert("Failed to update recipe");
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
				{formData.imagePreview && (
					<div>
						<img
							src={`${BACKEND_URL}/api/uploads/${formData.imagePreview}`}
							alt="RecipeImage"
							style={{ width: "200px" }}
						/>
					</div>
				)}
				<input type="file" name="image" onChange={handleFileChange} />
			</div>
			<div className="form-group">
				<label>Tags</label>
				<div className="edit-recipe__tag-list">
					{formData.tags.map((tag, index) => (
						<div key={index} className="edit-recipe__tag-item">
							<input
								type="text"
								value={tag}
								onChange={(e) =>
									handleItemChange("tags", index, e)
								}
							/>
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
						</div>
					))}
				</div>
			</div>
			<button
				type="button"
				onClick={() => handleAddItem("tags")}
				className="edit-recipe__add-button"
			>
				Ajouter un Tag
			</button>
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
						<div
							key={index}
							className="edit-recipe__ingredient-item"
						>
							<input
								type="text"
								value={ingredient}
								onChange={(e) =>
									handleItemChange("ingredients", index, e)
								}
								required
							/>
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
						</div>
					))}
				</div>
			</div>
			<button
				type="button"
				onClick={() => handleAddItem("ingredients")}
				className="edit-recipe__add-button"
			>
				Ajouter un ingrédient
			</button>

			<div className="form-group">
				<label>Étapes</label>
				<div className="edit-recipe__step-list">
					{formData.steps.map((step, index) => (
						<div key={index} className="edit-recipe__step-item">
							<input
								type="text"
								value={step}
								onChange={(e) =>
									handleItemChange("steps", index, e)
								}
								required
							/>
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
						</div>
					))}
				</div>
			</div>
			<button
				type="button"
				onClick={() => handleAddItem("steps")}
				className="edit-recipe__add-button"
			>
				Ajouter une étape
			</button>

			<button type="submit" className="submit-btn">
				Update Recipe
			</button>
		</form>
	);
}

export default EditRecipe;
