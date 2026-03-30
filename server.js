const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const db = require("./db");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ----------------------
// ROUTES
// ----------------------

// GET all users
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// GET one user
app.get("/users/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        // 2. BETTER ERROR HANDLING
if (err) {
    return res.status(500).json({
        message: "Database error",
        error: err.message
    });
}

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(results[0]);
    });
});

// POST create user
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    db.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            res.status(201).json({
                message: "User created",
                id: result.insertId
            });
        }
    );
});

// PUT update user
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    db.query(
        "UPDATE users SET name=?, email=? WHERE id=?",
        [name, email, id],
        (err, result) => {
           // 2. BETTER ERROR HANDLING
if (err) {
    return res.status(500).json({
        message: "Database error",
        error: err.message
    });
}

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ message: "User updated" });
        }
    );
});

// DELETE user
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
        // 2. BETTER ERROR HANDLING
if (err) {
    return res.status(500).json({
        message: "Database error",
        error: err.message
    });
}

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted" });
    });
});

// ----------------------
// ERROR HANDLER
// ----------------------
app.use((err, req, res, next) => {
    res.status(500).json({ message: "Something went wrong" });
});

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

