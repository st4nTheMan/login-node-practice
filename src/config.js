const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/my-website");

//Check database conneccion
connect.then(() => {
    console.log("Database connected successfully");
});

//Create a schema
const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//Collection Part
const collection = new mongoose.model("users", loginSchema);

module.exports = collection;