exports.sendOrderConfirmation = (email, orderId) => {
    setTimeout(() => {
        console.log(`Email sent to ${email} for order ${orderId}`);
    }, 2000);
};
