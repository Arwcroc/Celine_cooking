const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
		const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login successful", isAdmin: true, token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;