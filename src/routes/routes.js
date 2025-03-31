const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config');

// Login page
router.get("/login", (req, res) => {
    res.render("login");
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
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.render("login", { alertMessage: "All fields are required.", alertType: "danger" });
        }

        const checkUser = await db.findOne(username);
        if (!checkUser) {
            return res.render("login", { alertMessage: "User does not exist.", alertType: "danger" });
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
            return res.render("login", { alertMessage: "Incorrect username or password.", alertType: "danger" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.render("login", { alertMessage: "An error occurred. Please try again.", alertType: "danger" });
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