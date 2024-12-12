const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(process.env.DATABASE_DIR, process.env.DATABASE_FILENAME);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erreur lors de la connexion à SQLite:", err.message);
    } else {
        console.log("Connecté à la base SQLite");
    }
});

const makeQuery = (query) => {
    return db.run(query);
};

const selectQuery = (query, params, callback) => {
	db.all(query, params, callback);
};

const createDatabaseAndTables = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            image TEXT,
            servings INTEGER NOT NULL,
            ingredients TEXT NOT NULL,
            steps TEXT NOT NULL,
            diet TEXT,
            tags TEXT
        );
    `;

    db.serialize(() => {
        db.run(createTableQuery, (err) => {
            if (err) {
                console.error("Erreur lors de la création de la table 'recipes':", err.message);
            } else {
                console.log("Table 'recipes' OK");
            }
        });
    });
};

createDatabaseAndTables();

exports.makeQuery = makeQuery;
exports.selectQuery = selectQuery;
