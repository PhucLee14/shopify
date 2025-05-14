const express = require("express");
const app = express();
const productRoutes = require("./routes/products");

app.use(express.json());
app.use("/api/products", productRoutes);

module.exports = app;
