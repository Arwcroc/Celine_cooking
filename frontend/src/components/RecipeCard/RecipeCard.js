import React from 'react';
import './RecipeCard.css';
import logo from '../../assets/images/Sans titre 2.jpeg';

function RecipeCard(props) {
	const { recipe } = props;

	return (
		<div className="recipe-card">
      		<img src={recipe.image ? `http://localhost:5001/uploads/${recipe.image}` : logo} alt={recipe.title} className="recipe-card__image" />
			<div className="recipe-card__content">
				<h3 className="recipe-card__title">{recipe.title}</h3>
				<div className="tags">
					{recipe.diet && (
						<span className="recipe-card__diet">{recipe.diet === 'vegan' ? 'Vegan' : 'Végétarien'}</span>
					)}
					{recipe.tags && recipe.tags.map((tag, index) => (
						<span key={index} className="tag">{tag}</span>
					))}
				</div>
				<a href={`/recipes/${recipe.id}`} className="recipe-card__button">Lire la recette</a>
			</div>
		</div>

	);
}

export default RecipeCard;