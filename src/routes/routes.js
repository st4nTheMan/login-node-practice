const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config');

// Login page
router.get("/login", (req, res) => {
    const alertMessage = req.session.alertMessage || null;
    const alertType = req.session.alertType || null;

    // Clear after reading
    req.session.alertMessage = null;
    req.session.alertType = null;

    res.render("login", { alertMessage, alertType });
});

// Register page
router.get("/register", (req, res) => {
    res.render("register", { 
        errors: {},
        firstName: "",
        lastName: "",
        username: "",
        email: ""
    });
});


// Home page
router.get("/home", (req, res) => {
    if (req.session.user) {
        res.render("home", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
});

// Profile page
router.get("/profile", (req, res) => {
    if (req.session.user) {
        res.render("profile", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
});

// Register user
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        let errors = {};

        // Manual validation
        if (!firstName || firstName.trim() === "") {
            errors.firstName = "First name is required.";
        }
        if (!lastName || lastName.trim() === "") {
            errors.lastName = "Last name is required.";
        }
        if (!username || username.trim() === "") {
            errors.username = "Username is required.";
        }
        if (!password || password.trim() === "") {
            errors.password = "Password is required.";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }

        // If validation fails
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        // Check if username or email already exists
        
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to DB
        await db.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });

        // Send success JSON
        return res.status(200).json({
            message: "Successfully registered."
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "An error occurred during registration."
        });
    }
});



// POST /login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            req.session.alertMessage = "All fields are required.";
            req.session.alertType = "danger";
            return res.redirect("/login");
        }

        const checkUser = await db.findOne(username);
        if (!checkUser) {
            req.session.alertMessage = "User does not exist.";
            req.session.alertType = "danger";
            return res.redirect("/login");
        }

        const userValidation = await bcrypt.compare(password, checkUser.password);
        if (userValidation) {
            req.session.user = {
                username: checkUser.username,
                firstName: checkUser.firstName,
                lastName: checkUser.lastName
            };
            return res.redirect("/home");
        } else {
            req.session.alertMessage = "Incorrect username or password.";
            req.session.alertType = "danger";
            return res.redirect("/login");
        }
    } catch (error) {
        console.error("Error during login:", error);
        req.session.alertMessage = "An error occurred. Please try again.";
        req.session.alertType = "danger";
        return res.redirect("/login");
    }
});

// Logout user
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.redirect("/home");
        }
        res.redirect("/login");
    });
});

module.exports = router;