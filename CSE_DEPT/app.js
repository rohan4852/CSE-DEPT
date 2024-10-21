const express = require('express');
const mysql = require('mysql');
const app = express();

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cse_dept'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

app.use(express.json());

// API endpoint to handle user registration
app.post('/submit', (req, res) => {
    console.log('Received form submission:', req.body);
    const { name, phone, email, password } = req.body;

    // Hash the password using bcrypt
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: 'Failed to register user!' });
            return;
        }

        // Insert user data into the database
        const query = `INSERT INTO sign_up (name, phone, email, password) VALUES (?, ?, ?, ?)`;
        db.query(query, [name, phone, email, hash], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: 'Failed to register user!!' });
                return;
            }

            res.send({ message: 'User registered successfully!' });
        });
    });
});

// Define a simple route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});