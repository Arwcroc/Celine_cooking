const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/auth');
const makeQuery = require("./utils/db");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file.filename;

    const sql = 'INSERT INTO images (path) VALUES (?)';
    makeQuery(sql, [image], (err, result) => {
        if (err) throw err;
        res.send('Image uploadée et enregistrée dans la base de données');
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to MyRecipe API');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

