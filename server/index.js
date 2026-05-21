const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/orders', async (req, res) => {
    const { item_id, quantity } = req.body;
    try {
        await pool.query('INSERT INTO customer_orders (item_id, quantity) VALUES ($1, $2)', [item_id, quantity]);
        res.status(201).json({ message: 'Order Placed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/purchase-orders', async (req, res) => {
    const { item_id, quantity } = req.body;
    try {
        await pool.query('INSERT INTO purchase_orders (item_id, quantity) VALUES ($1, $2)', [item_id, quantity]);
        res.status(201).json({ message: 'Purchase Order Created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/inward', async (req, res) => {
    const { po_id, item_id, quantity } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('UPDATE purchase_orders SET status = $1 WHERE id = $2', ['Inwarded', po_id]);
        await client.query('UPDATE items SET stock = stock + $1 WHERE id = $2', [quantity, item_id]);
        await client.query('COMMIT');
        res.json({ message: 'Materials Inwarded and Inventory Updated' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

app.post('/api/production', async (req, res) => {
    const { raw_id, finished_id, raw_qty, finished_qty } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('UPDATE items SET stock = stock - $1 WHERE id = $2', [raw_qty, raw_id]);
        await client.query('UPDATE items SET stock = stock + $1 WHERE id = $2', [finished_qty, finished_id]);
        await client.query(
            'INSERT INTO production_logs (raw_material, finished_good, quantity_produced) VALUES ((SELECT name FROM items WHERE id = $1), (SELECT name FROM items WHERE id = $2), $3)', 
            [raw_id, finished_id, finished_qty]
        );
        await client.query('COMMIT');
        res.json({ message: 'Production successful, inventory updated' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

app.post('/api/outward', async (req, res) => {
    const { order_id, item_id, quantity } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('UPDATE customer_orders SET status = $1 WHERE id = $2', ['Shipped', order_id]);
        await client.query('UPDATE items SET stock = stock - $1 WHERE id = $2', [quantity, item_id]);
        await client.query('COMMIT');
        res.json({ message: 'Goods dispatched, inventory reduced' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

app.get('/api/reports/inventory', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items ORDER BY type, id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reports/orders', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT customer_orders.id, items.name, customer_orders.quantity, customer_orders.status 
            FROM customer_orders 
            JOIN items ON customer_orders.item_id = items.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reports/purchases', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT purchase_orders.id, items.name, purchase_orders.quantity, purchase_orders.status 
            FROM purchase_orders 
            JOIN items ON purchase_orders.item_id = items.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reports/production', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM production_logs ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));