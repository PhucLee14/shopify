-- Write a query to calculate the average order value (total price of items in an order)
-- for each month in the current year.
SELECT 
    MONTH(o.order_date) AS month,
    AVG(oi.quantity * oi.final_price) AS avg_order_value
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE YEAR(o.order_date) = YEAR(CURDATE())
GROUP BY MONTH(o.order_date)
ORDER BY month;

-- Write a query to calculate the churn rate of customers. The churn rate is defined as
-- the percentage of customers who did not make a purchase in the last 6 months but
-- had made a purchase in the 6 months prior to that.

WITH last_6_months AS (
    SELECT DISTINCT user_id
    FROM orders
    WHERE order_date >= CURDATE() - INTERVAL 6 MONTH
),
previous_6_months AS (
    SELECT DISTINCT user_id
    FROM orders
    WHERE order_date >= CURDATE() - INTERVAL 12 MONTH
      AND order_date < CURDATE() - INTERVAL 6 MONTH
),
churned_users AS (
    SELECT user_id
    FROM previous_6_months
    WHERE user_id NOT IN (SELECT user_id FROM last_6_months)
)
SELECT 
    (COUNT(c.user_id) * 100.0) / NULLIF((SELECT COUNT(*) FROM previous_6_months), 0) AS churn_rate_percent
FROM churned_users c;