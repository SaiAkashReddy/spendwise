# SpendWise REST API Documentation

This document describes the REST API endpoints, request/response formats, validation rules, and error handling for the **SpendWise** backend.

---

## 🌐 Base URL & Conventions

- **Default Server URL:** `http://localhost:5000`
- **API Base Path:** `/api`
- **Content Type:** `application/json` (for all `POST` and `PUT` request bodies)
- **Standard Response Envelope:**
  ```json
  {
    "success": true,
    "data": ...
  }
  ```
- **Standard Error Envelope:**
  ```json
  {
    "success": false,
    "error": "Short Error Category",
    "message": "Human-readable explanation of what went wrong"
  }
  ```

---

## 📊 Expense Data Schema

| Field | Type | Required | Default | Validation & Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Generated | Unique MongoDB 24-character hexadecimal identifier. |
| `amount` | `Number` | **Yes** | — | Positive number strictly greater than 0 (e.g. `25.50`). |
| `category` | `String` | **Yes** | — | Must be one of the allowed categories listed below. |
| `description` | `String` | **Yes** | — | Trimmed string between 1 and 200 characters. |
| `date` | `Date` | **Yes** | — | Valid ISO 8601 date string (e.g. `"2026-11-20"`). |
| `paymentMethod`| `String` | No | `"Cash"` | Must be one of the allowed payment methods listed below. |
| `createdAt` | `Date` | Auto | Generated | UTC timestamp of document creation. |
| `updatedAt` | `Date` | Auto | Generated | UTC timestamp of last document modification. |

### Allowed Categories
- `Food`
- `Travel`
- `Shopping`
- `Bills`
- `Entertainment`
- `Health`
- `Others`

### Allowed Payment Methods
- `Cash` (default)
- `UPI`
- `Card`
- `Other`

---

## 🚦 HTTP Status Codes Used

| Code | Status | When Used |
| :--- | :--- | :--- |
| `200` | OK | Successful `GET`, `PUT`, or `DELETE` request. |
| `201` | Created | Successful `POST /api/expenses` request. |
| `400` | Bad Request | Validation failure (missing required fields, amount <= 0, invalid category/date, invalid ObjectId format). |
| `404` | Not Found | Route does not exist or requested expense ID is not found in database. |
| `500` | Internal Server Error | Unhandled unexpected server error. |
| `503` | Service Unavailable | MongoDB is disconnected or unreachable. |

---

## 📑 Endpoints Reference

### 1. Health & Status

#### `GET /api/health`
Checks the server and MongoDB connectivity status.

- **Request:** None
- **Response (`200 OK`):**
  ```json
  {
    "status": "ok",
    "message": "SpendWise API is running smoothly",
    "database": "connected",
    "databaseConnected": true,
    "timestamp": "2026-11-20T07:15:00.000Z",
    "environment": "development"
  }
  ```

---

### 2. Expense Endpoints

#### `GET /api/expenses`
Returns all expenses. Sorted newest first by default.

- **Query Parameters (Optional):**
  - `sort`: `desc` / `newest` (default) or `asc` / `oldest`
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "673dd4940c6b12a345678901",
        "amount": 150.50,
        "category": "Food",
        "description": "Weekly grocery shopping",
        "date": "2026-11-20T00:00:00.000Z",
        "paymentMethod": "Card",
        "createdAt": "2026-11-20T07:00:00.000Z",
        "updatedAt": "2026-11-20T07:00:00.000Z"
      },
      {
        "_id": "673dd4940c6b12a345678902",
        "amount": 45.00,
        "category": "Travel",
        "description": "Metro card recharge",
        "date": "2026-11-19T00:00:00.000Z",
        "paymentMethod": "UPI",
        "createdAt": "2026-11-19T08:30:00.000Z",
        "updatedAt": "2026-11-19T08:30:00.000Z"
      }
    ]
  }
  ```
- **Empty Database Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 0,
    "data": []
  }
  ```

---

#### `GET /api/expenses/summary`
Calculates aggregated spending statistics.
> **Note:** This route is registered before `/api/expenses/:id` to avoid parameter conflicts.

- **Request:** None
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "totalAmount": 195.50,
      "totalExpenses": 2,
      "categoryTotals": [
        {
          "category": "Food",
          "total": 150.50,
          "count": 1
        },
        {
          "category": "Travel",
          "total": 45.00,
          "count": 1
        }
      ],
      "monthlyTotals": [
        {
          "month": "2026-11",
          "total": 195.50,
          "count": 2
        }
      ]
    }
  }
  ```

---

#### `GET /api/expenses/:id`
Retrieves a single expense by its 24-character hexadecimal MongoDB ObjectId.

- **URL Parameter:** `id` (e.g. `673dd4940c6b12a345678901`)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "673dd4940c6b12a345678901",
      "amount": 150.50,
      "category": "Food",
      "description": "Weekly grocery shopping",
      "date": "2026-11-20T00:00:00.000Z",
      "paymentMethod": "Card",
      "createdAt": "2026-11-20T07:00:00.000Z",
      "updatedAt": "2026-11-20T07:00:00.000Z"
    }
  }
  ```
- **Error Response (`404 Not Found`):**
  ```json
  {
    "success": false,
    "error": "Not Found",
    "message": "Expense with ID 673dd4940c6b12a345678901 was not found"
  }
  ```
- **Error Response (`400 Bad Request - Invalid ID`):**
  ```json
  {
    "success": false,
    "error": "Invalid ID Format",
    "message": "\"123-invalid-id\" is not a valid MongoDB ObjectId. An ObjectId must be a 24-character hex string."
  }
  ```

---

#### `POST /api/expenses`
Creates a new expense.

- **Request Body (JSON):**
  ```json
  {
    "amount": 75.00,
    "category": "Entertainment",
    "description": "Movie tickets for two",
    "date": "2026-11-20",
    "paymentMethod": "UPI"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Expense created successfully",
    "data": {
      "_id": "673dd4940c6b12a345678903",
      "amount": 75.00,
      "category": "Entertainment",
      "description": "Movie tickets for two",
      "date": "2026-11-20T00:00:00.000Z",
      "paymentMethod": "UPI",
      "createdAt": "2026-11-20T07:15:00.000Z",
      "updatedAt": "2026-11-20T07:15:00.000Z"
    }
  }
  ```
- **Error Response (`400 Bad Request - Validation Failure`):**
  ```json
  {
    "success": false,
    "error": "Validation Error",
    "message": "Amount must be greater than zero; Invalid category: \"Gambling\". Allowed categories are: Food, Travel, Shopping, Bills, Entertainment, Health, Others",
    "errors": [
      "Amount must be greater than zero",
      "Invalid category: \"Gambling\". Allowed categories are: Food, Travel, Shopping, Bills, Entertainment, Health, Others"
    ]
  }
  ```

---

#### `PUT /api/expenses/:id`
Updates an existing expense. Accepts partial updates (at least one valid field is required).

- **URL Parameter:** `id` (MongoDB ObjectId)
- **Request Body (JSON):**
  ```json
  {
    "amount": 80.00,
    "paymentMethod": "Card"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Expense updated successfully",
    "data": {
      "_id": "673dd4940c6b12a345678903",
      "amount": 80.00,
      "category": "Entertainment",
      "description": "Movie tickets for two",
      "date": "2026-11-20T00:00:00.000Z",
      "paymentMethod": "Card",
      "createdAt": "2026-11-20T07:15:00.000Z",
      "updatedAt": "2026-11-20T07:20:00.000Z"
    }
  }
  ```

---

#### `DELETE /api/expenses/:id`
Deletes an expense document by its ID.

- **URL Parameter:** `id` (MongoDB ObjectId)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Expense deleted successfully",
    "data": {
      "id": "673dd4940c6b12a345678903",
      "description": "Movie tickets for two",
      "amount": 80.00
    }
  }
  ```

---

## 🛡️ Database Availability Guard

If MongoDB is down, stopped, or unreachable, requests to `/api/expenses/*` do not silently fail or hang. They immediately return:

- **Response (`503 Service Unavailable`):**
  ```json
  {
    "success": false,
    "error": "Database Unavailable",
    "message": "The MongoDB database is currently disconnected. Please verify that MongoDB is running and MONGO_URI is configured correctly."
  }
  ```

---

## 🧪 Testing the API

To run the automated test suite:

```bash
cd server
npm test
```
Tests automatically execute in-memory unit and middleware tests, and will automatically run live integration tests if MongoDB is active.
