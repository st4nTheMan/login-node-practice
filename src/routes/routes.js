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
    res.render("register");
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