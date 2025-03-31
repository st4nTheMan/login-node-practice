require('dotenv').config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const routes = require('./routes/routes');

const app = express();

// Convert data into JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Using EJS to view engine
app.set('view engine', 'ejs');

// Static file
app.use(express.static("public"));

// Session management
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Root route
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Use routes
app.use('/', routes);

// Server connection
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});