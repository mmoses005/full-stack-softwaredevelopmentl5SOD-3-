const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const PORT = 3000;

// Route
app.get("/", (req, res) => {
    res.json({ message: "Server is working 🚀" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});