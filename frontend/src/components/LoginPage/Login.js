import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				`${BACKEND_URL}/auth/login`,
				{
					username,
					password,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const { token } = response.data;
			localStorage.setItem("token", token);
			setMessage("Login successful");
			navigate(`/`);
		} catch (error) {
			console.error("Error login:", error);
			setMessage("Invalid credentials");
		}
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h2>Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="input-group">
						<label>Username:</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your username"
						/>
					</div>
					<div className="input-group">
						<label>Password:</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
						/>
					</div>
					<button type="submit" className="login-button">
						Login
					</button>
				</form>
				{message && <p className="login-message">{message}</p>}
			</div>
		</div>
	);
};

export default Login;
