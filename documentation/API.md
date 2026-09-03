# KrishiDirect — REST API Reference Documentation

Base URL: `http://localhost:5000/api` (Local) / `https://<render-backend>/api` (Production)

---

## 1. Authentication & Users
All protected routes require standard Bearer token in the `Authorization` header:
`Authorization: Bearer <jwt_token>`

### `POST /api/auth/register/customer`
* **Access:** Public
* **Body:**
  ```json
  {
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+91 98200 11001",
    "password": "Password123!",
    "address": {
      "street": "14th Road, Bandra",
      "city": "Mumbai",
      "district": "Mumbai Suburban",
      "state": "Maharashtra",
      "pincode": "400050"
    }
  }
  ```
* **Response (201):** Returns JWT token and sanitized customer user profile.

### `POST /api/auth/register/farmer`
* **Access:** Public
* **Body:**
  ```json
  {
    "name": "Ramesh Patel",
    "email": "ramesh@farm.com",
    "phone": "+91 98201 11223",
    "password": "FarmerPassword123!",
    "farmName": "Green Valley Organic Farm",
    "location": "Dindori",
    "district": "Nashik",
    "state": "Maharashtra",
    "pincode": "422202",
    "cropTypes": "Vegetables, Grains",
    "farmingMethod": "Organic",
    "yearsExperience": 14,
    "farmSizeAcres": 15,
    "description": "Certified organic farm",
    "organicCertified": true
  }
  ```
* **Response (201):** Creates User with `role: "farmer"` and FarmerProfile with `verificationStatus: "pending"`.

### `POST /api/auth/login`
* **Access:** Public
* **Body:** `{ "email": "admin@krishidirect.com", "password": "AdminPass123!" }`
* **Response (200):** Returns JWT token, user object, and farmer profile (if farmer).

### `GET /api/auth/me`
* **Access:** Protected
* **Response (200):** Current authenticated user details and farm profile.

---

## 2. Farmer Endpoints

### `GET /api/farmers`
* **Access:** Public
* **Query Parameters:** `search`, `location`, `district`, `state`, `crop`, `farmingMethod`, `organic`, `minRating`, `sort`, `page`, `limit`
* **Response (200):** List of verified farmers with product counts and pagination metadata.

### `GET /api/farmers/:id`
* **Access:** Public
* **Response (200):** Farm details, grower biography, soil practices, and active products.

### `GET /api/farmers/compare`
* **Access:** Public
* **Query Parameters:** `?ids=id1,id2,id3` (2 to 4 comma-separated farmer IDs)
* **Response (200):** Normalized comparison metrics calculated directly from database records:
  * `avgProductPrice`, `productCount`, `latestHarvestDate`, `fulfilmentRate`, `rating`, `reviewCount`, `deliveryOptions`, `typicalDeliveryTime`, `minimumOrder`.
  * Highlight badges: `isBestPrice`, `isHighestRating`, `isFastestDelivery`, `isOrganicVerified`, `isMostProducts`.

### `PUT /api/farmers/profile`
* **Access:** Protected (Farmer only)
* **Body:** Updates farm name, location, methods, harvest practices, delivery details.

### `GET /api/farmers/analytics`
* **Access:** Protected (Farmer only)
* **Response (200):** Real-time sales KPIs, monthly revenue arrays, top-selling crops, repeat buyers.

---

## 3. Product Endpoints

### `GET /api/products`
* **Access:** Public
* **Query Parameters:** `search`, `category`, `farmer`, `location`, `organic`, `minPrice`, `maxPrice`, `rating`, `sort`, `page`, `limit`
* **Response (200):** Filtered agricultural listings with farmer and farm profile populated.

### `GET /api/products/:id`
* **Access:** Public
* **Response (200):** Product record and related crops from the same farmstead or category.

### `POST /api/products`
* **Access:** Protected (Farmer only)
* **Body:** `name`, `category`, `description`, `price`, `unit`, `stock`, `images`, `harvestDate`, `farmingMethod`, `organic`, `minimumOrderQuantity`

### `PUT /api/products/:id` & `DELETE /api/products/:id`
* **Access:** Protected (Farmer who owns product, or Admin)

---

## 4. Cart & Order Endpoints

### `GET /api/cart`
* **Access:** Protected (Customer only)
* **Response (200):** Basket items grouped by independent farmer, calculating farm subtotal, individual delivery fees, and grand total.

### `POST /api/cart/items`
* **Access:** Protected (Customer only)
* **Body:** `{ "productId": "...", "quantity": 2 }`

### `POST /api/orders`
* **Access:** Protected (Customer only)
* **Body:**
  ```json
  {
    "deliveryAddress": {
      "street": "14th Road",
      "city": "Mumbai",
      "district": "Mumbai Suburban",
      "state": "Maharashtra",
      "pincode": "400050",
      "contactNumber": "+91 98200 11001"
    },
    "deliverySlot": "Morning (7:00 AM - 10:00 AM)",
    "deliveryInstructions": "Leave at front desk",
    "paymentMethod": "Cash on Delivery"
  }
  ```
* **Process:** Performs atomic stock deduction, creates separate orders per farmer dispatch, clears basket, returns created order records.

### `PATCH /api/orders/:id/status`
* **Access:** Protected (Farmer of order or Admin)
* **Body:** `{ "status": "Confirmed", "note": "Harvesting at dawn" }`
* **Allowed Statuses:** `Pending`, `Confirmed`, `Preparing`, `Ready for Dispatch`, `Out for Delivery`, `Delivered`, `Cancelled`.

---

## 5. Administration Endpoints

### `GET /api/admin/dashboard`
* **Access:** Protected (Admin only)
* **Response (200):** KPIs (GMV, total farmers, verified, pending, orders, disputes), 6-month sales trend, crop distribution.

### `PATCH /api/admin/farmers/:id/approve` & `reject`
* **Access:** Protected (Admin only)
* **Body:** `{ "notes": "Audited land documents" }`

### `PATCH /api/admin/users/:id/status`
* **Access:** Protected (Admin only)
* **Body:** `{ "status": "active" | "suspended" }`

### `PATCH /api/admin/disputes/:id`
* **Access:** Protected (Admin only)
* **Body:** `{ "status": "resolved", "adminNote": "Refund issued" }`