const mysql = require("mysql2");
require("dotenv").config();

const createDatabaseAndTables = async () => {
	const connection = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});

	connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err) => {
		if (err) {
			console.error("Erreur lors de la création de la base de données:", err);
			return;
		}
		console.log(`DB '${process.env.DB_NAME}' OK`);

		const db = mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

		const createTableQuery = `
			CREATE TABLE IF NOT EXISTS recipes (
				id INT AUTO_INCREMENT PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				image VARCHAR(255),
				servings INT NOT NULL,
				ingredients JSON NOT NULL,
				steps JSON NOT NULL,
				diet VARCHAR(255),
				tags JSON
			)
		`;

		db.query(createTableQuery, (err) => {
			if (err) {
				console.error("Erreur lors de la création de la table 'recipes':", err);
			} else {
				console.log("Table 'recipes' OK");
			}
			db.end();
		});
	});

	connection.end();
};

createDatabaseAndTables();

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

db.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err);
		return;
	}
	console.log("Connected to MySQL database");
});

module.exports = db;
