const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");

router.get("/", productController.getAllProducts);
router.get(
    "/categories/:categoryId/products",
    productController.getProductsByCategory
);
router.get("/products/search", productController.searchProducts);
router.post("/orders", orderController.createOrder);

// router.post("/order/confirm", productController.sendConfirmationEmail);

module.exports = router;
