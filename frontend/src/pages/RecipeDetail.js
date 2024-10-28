import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/Sans titre 2.jpeg";
import "./RecipeDetail.css";

function RecipeDetail(isAdmin) {
	const { id } = useParams();
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState(null);
	const [servings, setServings] = useState(1);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	useEffect(() => {
		const fetchRecipe = async () => {
			try {
				const response = await axios.get(
					`${BACKEND_URL}/api/recipes/${id}`
				);
				setRecipe(response.data);
				setServings(response.data.servings);
			} catch (error) {
				console.error("Error fetching the recipe:", error);
			}
		};

		fetchRecipe();
	}, [id]);

	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this recipe?"
		);
		if (confirmDelete) {
			try {
				await axios.delete(
					`http://localhost:5001/api/recipes/${recipe.id}`
				);
				alert("Recipe deleted successfully");
				navigate("/");
			} catch (error) {
				console.error("Error deleting recipe:", error);
				alert("Failed to delete recipe");
			}
		}
	};

	// const handleServingsChange = (e) => {
	//     setServings(e.target.value);
	// };

	// const calculateIngredients = (ingredient) => {
	// 	const words = ingredient.split(' ');
	// 	const amount = parseFloat(words[0]);
	// 	if (isNaN(amount)) {
	// 		return ingredient;
	// 	} else {
	// 		const adjustedAmount = (amount * servings) / recipe.servings;
	// 		return `${adjustedAmount} ${words.slice(1).join(' ')}`;
	// 	}
	// };

	if (!recipe) {
		return <div>Loading...</div>;
	}

	return (
		<div className="recipe-detail">
			<button className="btn-return" onClick={() => navigate(`/`)}>
				{"<<"}
			</button>
			<div className="recipe-header">
				<img
					src={
						recipe.image
							? `http://localhost:5001/uploads/${recipe.image}`
							: logo
					}
					alt={recipe.title}
					className="recipe-image"
				/>
				<h1 className="recipe-title">{recipe.title}</h1>
			</div>
			<div className="tags">
				{recipe.diet && (
					<span className="recipe-detail__diet">
						{recipe.diet === "vegan" ? "Vegan" : "Végétarien"}
					</span>
				)}
				{recipe.tags &&
					recipe.tags.map((tag, index) => (
						<span key={index} className="tag">
							{tag}
						</span>
					))}
			</div>
			<div className="recipe-serving">
				<label>Nombre de parts : {servings}</label>
				{/* <input type="number" value={servings} onChange={handleServingsChange} /> */}
			</div>
			<div className="recipe-body">
				<div className="ingredients">
					<h2>Ingrédients</h2>
					{recipe.ingredients &&
						recipe.ingredients.map((ingredient, index) => (
							<li key={index}>{ingredient}</li>
						))}
				</div>
				<div className="steps">
					<h2>Étapes</h2>
					<ol>
						{recipe.steps &&
							recipe.steps.map((step, index) => (
								<li key={index}>{step}</li>
							))}
					</ol>
				</div>
			</div>
			{isLoggedIn && (
				<div className="recipe-actions">
					<button
						className="btn-edit"
						onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
					>
						Edit
					</button>
					<button className="btn-delete" onClick={handleDelete}>
						Delete
					</button>
				</div>
			)}
		</div>
	);
}

export default RecipeDetail;
