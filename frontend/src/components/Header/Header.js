import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/images/Sans titre 2.jpeg";
import SearchBar from "../SearchBar/SearchBar";

function Header({ onSearch }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	const handleLogout = () => {
		const confirmLogout = window.confirm(
			"Are you sure you want to Logout ?"
		);
		if (confirmLogout) {
			localStorage.removeItem("token");
			setIsLoggedIn(false);
			navigate("/");
		}
	};

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
					{isLoggedIn && (
						<li>
							<a href="/add-recipe">Ajouter</a>
							<button onClick={handleLogout} className="header__nav_logout">Logout</button>
						</li>
					)}
					{!isLoggedIn && (
						<li>
							<a href="/login">Login</a>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
}

export default Header;
