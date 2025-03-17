const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "../public/assets")));

// API endpoint to return a message
app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
