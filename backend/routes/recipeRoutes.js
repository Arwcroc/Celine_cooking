const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../utils/db");

// const makeQuery = db.makeQuery;
const selectQuery = db.selectQuery;
const router = express.Router();

router.get("/", (req, res) => {
	const sql = "SELECT * FROM recipes";

	selectQuery(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).json({ message: err.message });
			return;
		}
		const result = rows.map(row => {
			const tags = JSON.parse(row.tags)
			const steps = JSON.parse(row.steps)
			const ingredients = JSON.parse(row.ingredients)
			return {
				...row,
				tags:tags,
				steps:steps,
				ingredients:ingredients,
			};
		})
		res.json(result);
	})
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), (req, res) => {
	const { title, ingredients, steps, servings, diet, tags } = req.body;
	const image = req.file ? req.file.filename : null;

	const parsedIngredients = JSON.parse(ingredients);
	const parsedSteps = JSON.parse(steps);
	const parsedTags = JSON.parse(tags);

	if (!title || !ingredients || !steps || !servings) {
		return res.status(400).send("All fields are required");
	}

	const query =
		"INSERT INTO recipes (title, image, servings, ingredients, steps, diet, tags) VALUES (?, ?, ?, ?, ?, ?, ?)";
	selectQuery(
		query,
		[
			title,
			image,
			servings,
			JSON.stringify(parsedIngredients),
			JSON.stringify(parsedSteps),
			diet,
			JSON.stringify(parsedTags),
		],
		(err, result) => {
			if (err) {
				console.error("Error adding recipe:", err);
				return res.status(500).send("Error adding recipe");
			}
			res.json({
				message: "Recipe added successfully",
				recipeId: result.insertId,
			});
		}
	);
});

const deleteUnusedImages = () => {
	const sql = "SELECT image FROM recipes";
	// makeQuery(query, (err, results) => {
	selectQuery(sql, [], (err, results) => {
		if (err) {
			console.error(err);
			return;
		}

		const startPath = "./uploads";
		const files = fs.readdirSync(startPath);
		files.forEach((file) => {
			const filename = path.join(startPath, file);
			if (fs.lstatSync(filename).isDirectory()) return;
			if (results.find((res) => res.image === file) === undefined) {
				console.log(`Deleted ${filename}`);
				fs.rmSync(filename);
			}
		});
	});
};

router.put("/:id", upload.single("image"), (req, res) => {
	const recipeId = req.params.id;
	const { title, ingredients, steps, servings, diet, tags } = req.body;
	let image = null;

	const selectImageSql = "SELECT image FROM recipes WHERE id = ?";

	selectQuery(selectImageSql, [recipeId], (err, results) => {
		if (err) {
			console.error(err);
			return res
				.status(400)
				.json({ error: `Failed to fetch current image: ${err}` });
		}

		image = req.file ? req.file.filename : results[0].image;

		const sql =
			"UPDATE recipes SET title = ?, image = ?, ingredients = ?, steps = ?, servings = ?, diet = ?, tags = ? WHERE id = ?";
		selectQuery(
			sql,
			[title, image, ingredients, steps, servings, diet, tags, recipeId],
			(err, result) => {
				if (err) {
					console.error(err);
					return res
						.status(400)
						.json({ error: `Failed to update recipe: ${err}` });
				}
				deleteUnusedImages();
				res.json({ message: "Recipe updated successfully" });
			}
		);
	});
});

router.delete("/:id", (req, res) => {
	const recipeId = req.params.id;
	const sql = "DELETE FROM recipes WHERE id = ?";

	selectQuery(sql, [recipeId], (err, result) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Failed to delete recipe" });
		}
		res.json({ message: "Recipe deleted successfully" });
	});
});

router.get("/:id", (req, res) => {
	const recipeId = req.params.id;
	const query = "SELECT * FROM recipes WHERE id = ?";

	selectQuery(query, [recipeId], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).json({ message: err.message });
			return;
		}
		const result = rows.map(row => {
			const tags = JSON.parse(row.tags)
			const steps = JSON.parse(row.steps)
			const ingredients = JSON.parse(row.ingredients)
			return {
				...row,
				tags:tags,
				steps:steps,
				ingredients:ingredients,
			};
		})
		res.json(result[0]);
	})
});

module.exports = router;
