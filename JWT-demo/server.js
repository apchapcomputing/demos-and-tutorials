require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const mariadb = require("./connection")
const jwt = require('jsonwebtoken');
const mariadb = require('mariadb')

app.use(express.json());

const posts = [
    {
        username: "Ashlyn",
        title: "Post 1"
    },
    {
        username: "Jim",
        title: "Post 2"
    }
]

const conn = mariadb.createConnection({
    // properties
    host: 'localhost', 
    user:'root', 
    password: 'chapman21',
    database: '',
    port: 3000
}).then(conn => {

    conn.query(
        'SELECT ID, COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS' +
        'WHERE CHARACTER_SET_NAME = ? LIMIT 2',
        ["UTF8MB4"]
    ).then(res => {
        console.log(res);
        conn.end();
    }).catch(err => {});

    conn.query("CREATE TEMPORARY TABLE myTable" + 
        "id int NOT NULL AUTO_INCREMENT, firstName varchar(256), lastName varchar(256), " + 
        " PRIMARY KEY (id)"
    ).then(() => {
        return conn.query("INSERT INTO tokens(id, lastName) VALUES (?, ?)", [
            42,
            "smith"
        ])
    }).then(res => {
        console.log(res);
        mariadb.end();
    }).catch(err => {});

}).catch(err => {
    console.log(err.message);
})

// conn.connect(function (error) {
//     if (!!error) {
//         console.log(error);
//     } else {
//         console.log("Connected");
//     }
// });

app.get('/', function(req, res) {
    console.log("got")
})

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    // know we have valid token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

let refreshTokens = [];

app.post('/token', (req, res) => {
    // creates new token
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        // replace refresh token in db
        res.json({ accessToken: accessToken });
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

app.post('/login', (req, res) => {
    // TODO: authenticate user

    const username = req.body.username;
    const user = { name: username }

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    // add tokens to table
    pool.batch("INSERT INTO tokens (token, username) VALUES ('accessToken', 'username')");
    res.json({ accessToken: accessToken, refreshToken: refreshToken });

})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

app.listen(3000, () => {
    console.log("Server 3000 running");
});
