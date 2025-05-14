const pool = require("../config/db.js");
const emailService = require("../services/emailService");

exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const [rows] = await pool.query(
            "SELECT * FROM products WHERE category_id = ?",
            [categoryId]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching products by category:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.searchProducts = async (req, res) => {
    const { keyword } = req.query;
    try {
        const [rows] = await pool.query(
            `SELECT * FROM products WHERE name LIKE ? OR description LIKE ?`,
            [`%${keyword}%`, `%${keyword}%`]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error searching products:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
