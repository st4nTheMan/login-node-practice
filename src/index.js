require("dotenv").config();
const express = require("express");
//const path = require("path");
const session = require("express-session");
const routes = require("./routes/routes");

const app = express();

// Convert data into JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session management (MUST be before routes)
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false, // better than true
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        secure: false // set to true if HTTPS
    }
}));

// Using EJS as view engine
app.set("view engine", "ejs");

// Static file
app.use(express.static("public"));

// Root route
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Use routes
app.use("/", routes);

// Server connection
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
