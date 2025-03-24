require('dotenv').config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const collection = require("./config");
const db = require('./config');

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
    secret: process.env.SECRET_KEY, // Use the secret key from environment variables
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/home", (req, res) => {
    if (req.session.user) {
        res.render("home", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
});

app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.render("profile", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
});

// Register user
app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });
        
        return res.render("register", { alertMessage: "Successfully registered.", alertType: "success" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.render("register", { alertMessage: "An error occurred.", alertType: "danger" });
    }
});

// Login user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check for empty fields
        if (!username || !password) {
            return res.render("login", { alertMessage: "All fields are required.", alertType: "danger" });
        }

        // Check if user exists in the database
        const checkUser = await db.findOne(username);
        if (!checkUser) {
            return res.render("login", { alertMessage: "User does not exist.", alertType: "danger" });
        }

        // Check if password matches the username to proceed
        const userValidation = await bcrypt.compare(password, checkUser.password);
        if (userValidation) {
            req.session.user = { 
                username: checkUser.username,
                firstName: checkUser.firstName,
                lastName: checkUser.lastName
            };
            return res.redirect("/home");
        } else {
            return res.render("login", { alertMessage: "Incorrect username or password.", alertType: "danger" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.render("login", { alertMessage: "An error occurred. Please try again.", alertType: "danger" });
    }
});

// Logout user
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.redirect("/home");
        }
        res.redirect("/login");
    });
});

// Server connection
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});