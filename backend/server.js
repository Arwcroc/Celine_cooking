const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/auth');
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

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1)
    }
    setInterval(() => {
        db.ping(err => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                process.exit(1)
            }
        })
    }, 1000)
    console.log('Connected to MySQL database');
});

app.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file.filename;

    // Enregistrer le chemin de l'image dans la base de données
    const sql = 'INSERT INTO images (path) VALUES (?)';
    db.query(sql, [image], (err, result) => {
        if (err) throw err;
        res.send('Image uploadée et enregistrée dans la base de données');
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to MyRecipe API');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

