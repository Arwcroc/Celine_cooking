import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard/RecipeCard";
import Header from "../components/Header/Header";
import "./HomePage.css";

function Homepage() {
	const [recipes, setRecipes] = useState([]);
	const [filteredRecipes, setFilteredRecipes] = useState([]);

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const response = await axios.get(
					`${BACKEND_URL}/api/recipes`
				);
				setRecipes(response.data);
				setFilteredRecipes(response.data);
			} catch (error) {
				console.error("Error fetching recipes:", error);
			}
		};
		fetchRecipes();
	}, []);

	const handleSearch = (query) => {
		const filtered = recipes.filter((recipe) => {
			const titleMatch = recipe.title
				.toLowerCase()
				.includes(query.toLowerCase());

			let ingredientsMatch = false;
			let tagsMatch = false;

			try {
				const ingredients = Array.isArray(recipe.ingredients)
					? recipe.ingredients
					: JSON.parse(recipe.ingredients);

				ingredientsMatch = ingredients.some((ingredient) =>
					ingredient.toLowerCase().includes(query.toLowerCase())
				);
			} catch (e) {
				console.error(
					"Invalid JSON for ingredients:",
					recipe.ingredients
				);
			}

			try {
				const tags = Array.isArray(recipe.tags)
					? recipe.tags
					: JSON.parse(recipe.tags);

				tagsMatch = tags.some((tag) =>
					tag.toLowerCase().includes(query.toLowerCase())
				);
			} catch (e) {
				console.error("Invalid JSON for tags:", recipe.tags);
			}

			return titleMatch || ingredientsMatch || tagsMatch;
		});

		setFilteredRecipes(filtered);
	};

	return (
		<div>
			<Header onSearch={handleSearch} />
			<main className="homepage">
				<h1>Les Recettes</h1>
				<div className="recipe-list">
					{filteredRecipes.map((recipe) => (
						<RecipeCard key={recipe.id} recipe={recipe} />
					))}
				</div>
			</main>
		</div>
	);
}

export default Homepage;
