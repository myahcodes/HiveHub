const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));

/*Database Connection*/
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: ''
});

/*The API Route that the frontend will "fetch" from*/
app.get('/api/posts', (req, res) => {
    const sql = "SELECT * FROM posts ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.listen(3000, () => console.log("Server: http://localhost:3000"));
