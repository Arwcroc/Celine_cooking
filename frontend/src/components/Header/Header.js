import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/images/Sans titre 2.jpeg";
import SearchBar from "../SearchBar/SearchBar";

function Header({ onSearch }) {
	return (
		<header className="header">
			<div className="header__logo">
				<Link to="/">
					<img
						src={logo}
						alt="CelineCooking Logo"
						className="header__logo-image"
					/>
				</Link>
			</div>
			<div className="header__search">
				<SearchBar onSearch={onSearch} />
			</div>
			<nav className="header__nav">
				<ul>
					<li>
						<a href="/add-recipe">Nouvelle Recette</a>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;
