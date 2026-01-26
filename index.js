const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rohith',
    database: 'myDiary'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log(req);
    res.status(200).json({ message: "Successful!" });
})

app.post('/registerUser', async (req, res) => {
    const { email, password } = req.body;
    console.log("User registered :", req.body);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
            'INSERT INTO Users(EmailID, HashedPassword) VALUES (?, ?)',
            [email, hashedPassword],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Database error");
                }

                res.status(200).send("Registration successful");
            }
        );

    } catch (err) {
        console.log(err);
        res.status(500).send("Error hashing password");
    }
});


app.post('/loginUser', async (req, res) => {
    console.log("User logged in :", req.body);
    const { email, password } = req.body;

    connection.query(
        'SELECT HashedPassword FROM Users WHERE EmailID=?',
        [email],
        async (err, results) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Database error");
            }

            if (results.length === 0) {
                return res.status(404).send("User not found");
            }

            const hashedPassword = results[0].HashedPassword;
            const match = await bcrypt.compare(password, hashedPassword);

            if (match) {
                return res.status(200).send("Login successful");
            } else {
                return res.status(401).send("Invalid password");
            }
        }
    );
});


app.post('/newPost', (req, res) => {
    const { postTitle, postDescription, } = req.body;

    connection.query(
        'INSERT INTO Posts(postTitle, postDescription) VALUES (?, ?)',
        [postTitle, postDescription],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Database error");
            }
            res.status(200).send("Post added successfully");
        }
    );
});

app.listen(3000, () => {
    console.log("Server started at port no. 3000!");
});
