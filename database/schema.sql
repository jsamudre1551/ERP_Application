CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, 
    stock INT DEFAULT 0
);

CREATE TABLE customer_orders (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES items(id),
    quantity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' 
);

CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES items(id),
    quantity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' 
);

INSERT INTO items (name, type, stock) VALUES 
('Wood', 'RAW_MATERIAL', 100),
('Iron', 'RAW_MATERIAL', 50),
('Wooden Chair', 'FINISHED_GOOD', 10),
('Sofa Set', 'FINISHED_GOOD', 5),
('Fabric', 'RAW_MATERIAL', 200),
('Foam Cushions', 'RAW_MATERIAL', 40);

CREATE TABLE production_logs (
    id SERIAL PRIMARY KEY,
    raw_material VARCHAR(255),
    finished_good VARCHAR(255),
    quantity_produced INT
);