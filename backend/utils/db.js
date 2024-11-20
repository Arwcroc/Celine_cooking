// const mysql = require("mysql2");
// require("dotenv").config();

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// 	waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0, 
// });

// const makeQuery = (query, callback) => {
//     db.connect((err) => {
//         if (err) {
//             console.error('Error connecting to MySQL:', err);
//             return;
//         }

//         db.query(query, callback)
//         db.end()
//     });
// }

// const createDatabaseAndTables = async () => {
//     const connection = mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//     });

//     connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err) => {
//         if (err) {
//             console.error("Erreur lors de la création de la base de données:", err);
//             return;
//         }
//         console.log(`DB '${process.env.DB_NAME}' OK`);

//         const db = mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME,
//         });

//         const createTableQuery = `
//             CREATE TABLE IF NOT EXISTS recipes (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 title VARCHAR(255) NOT NULL,
//                 image VARCHAR(255),
//                 servings INT NOT NULL,
//                 ingredients JSON NOT NULL,
//                 steps JSON NOT NULL,
//                 diet VARCHAR(255),
//                 tags JSON
//             );
//         `;

//         db.query(createTableQuery, (err) => {
//             if (err) {
//                 console.error("Erreur lors de la création de la table 'recipes':", err);
//             } else {
//                 console.log("Table 'recipes' OK");
//             }
//             db.end();
//         });
//     });

//     connection.end();
// };

// createDatabaseAndTables();

// module.exports = makeQuery;

const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const makeQuery = (query, params, callback) => {
    pool.query(query, params, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err);
        }
        callback(null, results);
    });
};

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
            );
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

module.exports = makeQuery;