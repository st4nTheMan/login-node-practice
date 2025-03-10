const express = require("express");
const path = express("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

//Convert data into JSON format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

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

    const data = {
        username: req.body.username,
        password: req.body.password
    }

    //User validation
    const existingUser = await collection.findOne({ username: data.username });
    if (existingUser) {
        res.render("register", { alertMessage: "Username already exists.", alertType: "danger" });
    } else {
        //Password hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userData = await collection.insertMany(data);
        res.render("register", { alertMessage: "Successfully registered.", alertType: "success" });
        console.log(userData);
    }

});

//Server connection
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
