const sqlite3 = require('sqlite3').verbose();

// Open the database
let db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the users database.');
});

// Create user table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Function to insert hardcoded data
function insertHardcodedData() {
    const users = [
        { username: 'user1', password: '123456' },
        { username: 'user2', password: '123456' },
        { username: 'user3', password: '123456' },
    ];

    users.forEach(user => {
        db.get(`SELECT * FROM users WHERE username = ?`, [user.username], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (!row) {
                db.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [user.username, user.password], function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                });
            } else {
                console.log(`User ${user.username} already exists.`);
            }
        });
    });
}

// Call the function to insert hardcoded data
insertHardcodedData();

module.exports = db;
