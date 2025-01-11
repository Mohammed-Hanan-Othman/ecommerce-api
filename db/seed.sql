-- Run this to insert "dummy" data into the tables.

-- Disable FK checks for bulk insert
SET session_replication_role = 'replica';

-- Suppliers
INSERT INTO "supplier" ("name", "email", "phone", "address", "created_at", "updated_at")
SELECT 
    'Supplier ' || i AS "name",
    'supplier' || i || '@example.com' AS "email",
    '555-123-' || LPAD(i::TEXT, 4, '0') AS "phone",
    'Address ' || i AS "address",
    NOW() AS "created_at",
    NOW() AS "updated_at"
FROM generate_series(1, 50) AS i;

-- Products
INSERT INTO "product" ("name", "description", "price", "quantity", "supplier_id", "created_at", "updated_at")
SELECT 
    'Product ' || i AS "name",
    'Description for Product ' || i AS "description",
    ROUND((random() * 100 + 1)::numeric, 2) AS "price",
    FLOOR(random() * 500 + 1) AS "quantity",
    FLOOR(random() * 50 + 1) AS "supplier_id", -- Random supplier
    NOW() AS "created_at",
    NOW() AS "updated_at"
FROM generate_series(1, 200) AS i;

-- Customers
INSERT INTO "customer" ("name", "email", "phone", "address", "created_at", "updated_at")
SELECT 
    'Customer ' || i AS "name",
    'customer' || i || '@example.com' AS "email",
    '555-456-' || LPAD(i::TEXT, 4, '0') AS "phone",
    'Customer Address ' || i AS "address",
    NOW() AS "created_at",
    NOW() AS "updated_at"
FROM generate_series(1, 100) AS i;

-- Orders
INSERT INTO "order" ("customer_id", "total_amount", "status", "created_at", "updated_at")
SELECT 
    FLOOR(random() * 100 + 1) AS "customer_id", -- Random customer
    ROUND((random() * 100 + 1)::numeric, 2) AS "total_amount",
    CASE 
        WHEN random() < 0.33 THEN 'pending'
        WHEN random() < 0.66 THEN 'shipped'
        ELSE 'completed'
    END AS "status",
    NOW() AS "created_at",
    NOW() AS "updated_at"
FROM generate_series(1, 300) AS i;

-- Order Items
INSERT INTO "order_item" ("order_id", "product_id", "quantity", "price", "created_at", "updated_at")
SELECT 
    FLOOR(random() * 300 + 1) AS "order_id", -- Random order
    FLOOR(random() * 200 + 1) AS "product_id", -- Random product
    FLOOR(random() * 10 + 1) AS "quantity",
    ROUND((random() * 100 + 1)::numeric, 2) AS "price",
    NOW() AS "created_at",
    NOW() AS "updated_at"
FROM generate_series(1, 1000) AS i;

-- Re-enable FK checks
SET session_replication_role = 'origin';


