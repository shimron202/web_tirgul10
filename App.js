// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./DB.js');

// Create an Express application
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', "./pages"); // Set the directory for views
app.set('view engine', 'ejs'); // Set the view engine to EJS

// Configure express-session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.get('/', (req, res) => {
    res.render('login');
});

// Route for rendering the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Route for handling login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        if (row) {
            // User found, store username in session and redirect to homePage
            req.session.loggedIn = true;
            req.session.username = username;
            res.redirect('/homePage');
        } else {
            // User not found, redirect back to login
            res.redirect('/login');
        }
    });
});

// Route for rendering the homePage
app.get('/homePage', (req, res) => {
    if (!req.session.loggedIn) {
        // User is not logged in, redirect to login page
        res.redirect('/login');
    } else {
        // User is logged in, retrieve username from session
        const username = req.session.username;
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            // Pass the username to the homePage
            res.render('homePage', { users: rows, username: username });
        });
    }
});

// Route for handling logout
app.get('/logout', (req, res) => {
    // Destroy the session and redirect to login page
    req.session.destroy(err => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/login');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
