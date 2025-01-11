## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Endpoints](#highlighted-api-endpoints)
  - [Pagination](#pagination)
  - [Filtering](#filtering)
  - [Products](#products)
  - [Orders](#orders)
  - [Customers](#customers)
  - [Suppliers](#suppliers)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)


# **E-commerce API**

## **Overview**
A RESTful API for managing products, orders, customers, and suppliers in an e-commerce system.  
This project is designed to demonstrate CRUD operations, relational database design, and efficient querying using Prisma ORM.  

## **Technologies Used**
- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**

## **Features**
- Manage products with detailed attributes.
- Process customer orders and associate them with order items.
- Handle supplier information for product inventory.
- Implement relational mappings between entities for efficient data management.
- Implement pagination for efficient handling of large datasets.
- Implement filtering to narrow down results based on specific criteria.

---

## **Getting Started**

### **Prerequisites**
Before you begin, ensure you have the following installed:
- **Node.js** (version 18.x or later)
- **PostgreSQL** (version 12.x or later)

### **Installation**
1. **Clone the repository**:
   ```bash
   https://github.com/mohammed-hanan-othman/ecommerce-api.git
   cd ecommerce-api
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:  
   Create a `.env` file in the root of the project and configure it as follows:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/db_name
   ```
   You can also specify a `PORT` number in `.env`

4. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the server**:
   ```bash
   npm run start
   ```

   The server will run on `http://localhost:5000` or on the specified `PORT`.

---

## **Highlighted API Endpoints**

### **Pagination**
Some endpoints in the API support pagination to handle large datasets efficiently. Use query parameters like `page` and `limit` to fetch specific portions of the data.

#### Example
**Request:**
```http
GET /products?page=2&limit=5
```

##### **Parameters:**
- `page`: The page number to fetch (default: 1).
- `limit`: The number of items per page (default: 20).

##### **Response:**
```json
{
	"message": "Success",
	"metadata": {
		"current_page": 2,
		"per_page": 5,
		"total_items": 200,
		"total_pages": 40,
		"has_next_page": true,
		"has_previous_page": true
	},
	"data": [
		{
			"id": 7,
			"name": "Product 7",
			"description": "Description for Product 7",
			"price": 24.5,
			"quantity": 450,
			"supplierId": 38,
			// ... more fields
		},
		{
			"id": 8,
			"name": "Product 8",
			"description": "Description for Product 8",
			"price": 27.71,
			"quantity": 99,
			"supplierId": 39,
			// ... more fields
		},
    // ... more products
  ]
}
```

### **Filtering**
Some endpoints support filtering to allow users to narrow down results based on specific criteria. Filtering is achieved by adding query parameters to the request URL.

#### Example
**Request:**
```http
GET /products/search?maxPrice=200&minPrice=50&limit=20
```
##### **Parameters:**
- `minPrice`: The minimum price to base search on.
- `maxPrice`: The maximum price to base search on.
- `limit`: The number of items per page as indicated in the ``Pagination`` section above.

**Response**
```json
{
	"message": "Success",
	"metadata": {
		"current_page": 1,
		"per_page": 20,
		"total_items": 99,
		"total_pages": 5,
		"has_next_page": true,
		"has_previous_page": false
	},
	"data": [
		{
			"id": 76,
			"name": "Product 76",
			"description": "Description for Product 76",
			"price": 50.12,
			"quantity": 218,
			"supplierId": 3,
			// ... more fields
		},
        // ... more products
    ]
}
```

---

### **Products**
- **GET** `/products`: Retrieve all products.
- **GET** `/products/:id`: Retrieve a single product by ID.
- **POST** `/products`: Add a new product.

  **Request Body**:
  ```json
  {
    "name": "Product Name",
    "price": 100,
    "quantity":200,
    "description": "Product description",
    "supplierId": 1
  }
  ```
  **Response:**
  ```json
  {
	"message": "Product created",
	"data": {
		"id": 202,
		"name": "Product Name",
		"description": "Product description",
		"price": 100,
		"quantity": 200,
		"supplierId": 1,
		// ... more fields
	}
  }
  ```

- **PUT** `/products/:id`: Update an existing product.
- **DELETE** `/products/:id`: Delete a product.
- **GET** `/products/search`: Search for products using filtering parameters such as `minPrice` and `maxPrice` (pagination supported).

### **Orders**
- **GET** `/orders`: Retrieve all orders.

  **Response:**
  ```json
  {
    "message": "Success",
	"metadata": {
		"current_page": 1,
		"per_page": 20,
		"total_items": 301,
		"total_pages": 16,
		"has_next_page": true,
		"has_previous_page": false
	},
	"data": [
		{
			"id": 1,
			"customerId": 73,
			"totalAmount": 41.11,
			"status": "completed",
			"createdAt": "date created",
			"updatedAt": "date updated",
			"orderItems": [
				{
					"id": 263,
					"orderId": 1,
					"productId": 29,
					"quantity": 7,
					"price": 73.81,
					// ... more fields
				},
				// ... more order items
			]
		},
        // ... more orders
    ]
  }
  ```
- **GET** `/orders/:id`: Retrieve a single order (and associated order items) by ID.

- **POST** `/orders`: Create a new order.  
  **Request Body**:
  ```json
  {
    "customerId": 1,
    "items": [
      { "productId": 79, "price":20, "quantity": 2 },
      { "productId": 67, "price":30, "quantity": 1 }
    ]
  }
  ```
  **Response**
  ```json
    {
	    "message": "Order created successfully",
        "data": {
            "id": 303,
            "customerId": 1,
            "totalAmount": 70,
            "status": "Pending",
            // ... more fields
        }
    }
  ```

- **GET** `/orders/search?status=pen&page=6`: Filter orders using parameters such as `status`. (supports partial match and pagination)

### **Customers**
- **GET** `/customers`: Retrieve all customers (supports pagination).
- **GET** `/customers/:id`: Retrieve a single customer by ID.
- **POST** `/customers`: Add a new customer.  
  **Request Body**:
  ```json
  {
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "Customer phone",
    "address": "Customer address"
  }
  ```
  **Response**
  ```json
    {
        "message": "Customer created",
        "data": {
            "id": 101,
            "name": "Customer Name",
            "email": "customer@example.com",
            "phone": "Customer phone",
            "address": "Customer address",
            // ... more fields
        }
    }
  ```

- **GET** `/customers/:id/orders`: Retrieve all orders for specific customers.

### **Suppliers**
- **GET** `/suppliers`: Retrieve all suppliers. (supports pagination)
- **GET** `/suppliers/:id`: Retrieve a single supplier by ID.
- **POST** `/suppliers`: Add a new supplier.  
  **Request Body**:
  ```json
  {
    "name": "Supplier Name",
    "email": "supplier@example.com",
    "phone": "supplier phone",
    "address" : "supplier address"
  }
  ```
  **Response**:
  ```json
  {
	"message": "Supplier created",
	"data": {
		"id": 52,
		"name": "Supplier 51",
		"email": "supplier51@example.com",
		"phone": "555-123-0051",
		"address": "Address 51",
		// ... more fields
	}
  }
  ```
- **GET** `/suppliers/:id/products`: Retrieve all products from a single supplier.
---

## **Error Handling**
Each API endpoint provides error information to assist users effectively.

#### Example
**Request:**
```http
GET /products/ab
```
**Response**
```json
{
	"error": "Invalid id or id not provided"
}
```
---
## **Database Schema**
Database schema information accessible from `prisma/schema.prisma` file or from the `db/queries.sql` folder.
