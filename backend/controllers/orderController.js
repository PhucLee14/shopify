const pool = require("../config/db");
const sendOrderConfirmationEmail = require("../utils/sendOrderConfirmationEmail"); // Import email service

exports.createOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { user_id, address_id, discount_id, payment_method, items } =
            req.body;

        if (
            !user_id ||
            !address_id ||
            !payment_method ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res
                .status(400)
                .json({ error: "Missing required fields or items is empty" });
        }

        await connection.beginTransaction();

        let total_price = 0;
        const detailedItems = [];

        for (const item of items) {
            const [variantRows] = await connection.query(
                "SELECT price, quantity FROM product_variants WHERE id = ? FOR UPDATE",
                [item.variant_id]
            );

            if (variantRows.length === 0) {
                throw new Error(`Variant ID ${item.variant_id} not found.`);
            }

            const variant = variantRows[0];

            if (variant.quantity < item.quantity) {
                throw new Error(
                    `Not enough quantity for variant ID ${item.variant_id}`
                );
            }

            const itemTotal = variant.price * item.quantity;
            total_price += itemTotal;

            detailedItems.push({
                variant_id: item.variant_id,
                quantity: item.quantity,
                original_price: variant.price,
                final_price: variant.price,
            });
        }

        if (discount_id) {
            const [discountRows] = await connection.query(
                "SELECT * FROM discounts WHERE id = ? AND is_active = TRUE AND start_date <= NOW() AND end_date >= NOW()",
                [discount_id]
            );

            if (discountRows.length === 0) {
                throw new Error("Invalid or inactive discount");
            }

            const discount = discountRows[0];

            if (total_price >= discount.min_order_amount) {
                let discountAmount = 0;
                if (discount.discount_amount) {
                    discountAmount = discount.discount_amount;
                } else if (discount.discount_percent) {
                    discountAmount =
                        (total_price * discount.discount_percent) / 100;
                }

                if (discount.max_discount_amount) {
                    discountAmount = Math.min(
                        discountAmount,
                        discount.max_discount_amount
                    );
                }

                total_price -= discountAmount;
            }
        }

        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, address_id, discount_id, total_price, payment_method) VALUES (?, ?, ?, ?, ?)",
            [
                user_id,
                address_id,
                discount_id || null,
                total_price,
                payment_method,
            ]
        );

        const orderId = orderResult.insertId;

        for (const item of detailedItems) {
            await connection.query(
                "INSERT INTO order_items (order_id, variant_id, quantity, original_price, final_price) VALUES (?, ?, ?, ?, ?)",
                [
                    orderId,
                    item.variant_id,
                    item.quantity,
                    item.original_price,
                    item.final_price,
                ]
            );

            await connection.query(
                "UPDATE product_variants SET quantity = quantity - ? WHERE id = ?",
                [item.quantity, item.variant_id]
            );
        }

        await connection.commit();

        // Gửi email xác nhận
        const userEmail = req.body.user_email; // Lấy email từ request body
        await sendOrderConfirmationEmail(userEmail, orderId, total_price);

        res.status(201).json({
            message: "Order created successfully",
            orderId,
        });
    } catch (error) {
        await connection.rollback();
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};
