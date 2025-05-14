const nodemailer = require("nodemailer");

const sendOrderConfirmationEmail = async (userEmail, orderId, totalPrice) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Order Confirmation",
        text: `Your order has been successfully placed.\n\nOrder ID: ${orderId}\nTotal Price: ${totalPrice} VND\n\nThank you for shopping with us!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Order confirmation email sent to", userEmail);
    } catch (error) {
        console.error("Error sending order confirmation email:", error);
        throw new Error("Failed to send email");
    }
};

module.exports = sendOrderConfirmationEmail;
