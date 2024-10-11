const express = require("express");
const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ message: "Login successful", isAdmin: true });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;