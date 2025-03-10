const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

//Convert data into JSON format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//Using EJS to view engine
app.set('view engine', 'ejs');

//Static file
app.use(express.static("public"));

//Routes
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

//Register user
app.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check for empty fields
    if (!username || !password || !confirmPassword) {
        return res.render("register", { alertMessage: "All fields are required.", alertType: "danger" });
    }

    //User validation
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
        return res.render("register", { alertMessage: "Username already exists.", alertType: "danger" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.render("register", { alertMessage: "Passwords do not match.", alertType: "danger" });
    }

    // Password hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = {
        username,
        email,
        password: hashedPassword
    };

    await collection.insertMany(data);
    res.render("register", { alertMessage: "Successfully registered.", alertType: "success" });
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
        const checkUser = await collection.findOne({ username });
        if (!checkUser) {
            return res.render("login", { alertMessage: "User does not exist.", alertType: "danger" });
        }

        // Check if password matches the username to proceed
        const userValidation = await bcrypt.compare(password, checkUser.password);
        if (userValidation) {
            return res.render("home");
        } else {
            return res.render("login", { alertMessage: "Incorrect username or password.", alertType: "danger" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.render("login", { alertMessage: "An error occurred. Please try again.", alertType: "danger" });
    }
});

//Server connection
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});