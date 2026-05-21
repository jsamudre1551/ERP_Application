# Manufacturing ERP System - API Documentation

Base URL: `http://localhost:5000/api`
Content-Type: `application/json`

---

## 1. Transactional Endpoints

### 1.1 Place Customer Order
Creates a new customer order for a finished good. Inventory is not deducted until the order is dispatched.

* **URL:** `/orders`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "item_id": 3,
    "quantity": 5
  }

  1.2 Create Purchase Order (PO)
Creates an inbound request to purchase raw materials.

URL: /purchase-orders

Method: POST

Body:

{
  "item_id": 1,
  "quantity": 50
}

1.3 Inward Materials
Receives raw materials from a pending PO, updates PO status, and increments physical stock.

URL: /inward

Method: POST

Body:
{
  "po_id": 1,
  "item_id": 1,
  "quantity": 50
}


1.4 Process Production
Executes a database transaction to consume raw materials and produce finished goods. Logs the production history.

URL: /production

Method: POST

Body:
{
  "raw_id": 1,
  "raw_qty": 10,
  "finished_id": 3,
  "finished_qty": 2
}

1.5 Dispatch / Outward Goods
Fulfills a pending customer order. Decrements physical stock and updates order status.

URL: /outward

Method: POST

Body:

{
  "order_id": 1,
  "item_id": 3,
  "quantity": 5
}

2. Reporting Endpoints (Read-Only)
2.1 Get Inventory Ledger
Retrieves current stock levels of all raw materials and finished goods.

URL: /reports/inventory

Method: GET

Success Response:

Code: 200 OK

Content:
[
  {
    "id": 1,
    "name": "Wood",
    "type": "RAW_MATERIAL",
    "stock": 100
  }
]

2.2 Get Customer Orders
Retrieves all customer orders with resolved item names.

URL: /reports/orders

Method: GET

Success Response:

Code: 200 OK

Content:

[
  {
    "id": 1,
    "name": "Wooden Chair",
    "quantity": 5,
    "status": "Pending"
  }
]

2.3 Get Purchase Orders
Retrieves all vendor purchase orders with resolved material names.

URL: /reports/purchases

Method: GET

Success Response:

Code: 200 OK

Content:

JSON
[
  {
    "id": 1,
    "name": "Iron",
    "quantity": 50,
    "status": "Inwarded"
  }
]

2.4 Get Production History
Retrieves the historical ledger of factory production runs.

URL: /reports/production

Method: GET

Success Response:

Code: 200 OK

Content:
[
  {
    "id": 1,
    "raw_material": "Wood",
    "finished_good": "Wooden Chair",
    "quantity_produced": 2
  }
]