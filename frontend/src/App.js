import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddRecipePage from "./pages/AddRecipePage";
import RecipeDetail from "./pages/RecipeDetail";
import EditRecipe from "./pages/EditRecipe";
import LoginPage from "./components/LoginPage/Login";
import "./App.css";

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/add-recipe" element={<AddRecipePage />} />
					<Route path="/recipes/:id" element={<RecipeDetail />} />
					<Route path="/edit-recipe/:id" element={<EditRecipe />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
