# System Architecture & Technical Specifications — KrishiDirect

## 1. High-Level Architectural Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend SPA (React + Vite)                    │
│                                                                        │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌─────────┐ │
│   │ Main Layout  │   │ Customer Hub │   │  Farmer Hub  │   │Admin Ops│ │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └────┬────┘ │
│          │                  │                  │                │      │
│   ┌──────┴──────────────────┴──────────────────┴────────────────┴────┐ │
│   │                React Router & Protected Route Guard              │ │
│   └─────────────────────────────────┬────────────────────────────────┘ │
│                                     │                                  │
│   ┌─────────────────────────────────┴────────────────────────────────┐ │
│   │         Context Providers (Auth, Cart, Farmer Compare)           │ │
│   └─────────────────────────────────┬────────────────────────────────┘ │
│                                     │                                  │
│   ┌─────────────────────────────────┴────────────────────────────────┐ │
│   │          Axios HTTP Client with Bearer JWT Interceptor           │ │
│   └─────────────────────────────────┬────────────────────────────────┘ │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ REST API Calls (/api/*)
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Backend API (Express.js)                        │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────────┐ │
│   │  Security Middlewares (Helmet, CORS, Rate-Limiting, JSON Parser)  │ │
│   └─────────────────────────────────┬────────────────────────────────┘ │
│                                     │                                  │
│   ┌─────────────────────────────────┴────────────────────────────────┐ │
│   │  Route Handlers & Auth/RBAC Guard (verifyToken, role: customer,  │ │
│   │                                           farmer, admin)         │ │
│   └─────────────────────────────────┬────────────────────────────────┘ │
│                                     │                                  │
│   ┌─────────────────────────────────┴────────────────────────────────┐ │
│   │       Controllers & Business Services Layer                      │ │
│   │       * farmerService (Dynamic Comparison Engine & Analytics)    │ │
│   │       * orderService (Atomic stock decrement & Farm Grouping)    │ │
│   │       * productController, cartController, reviewController      │ │
│   └─────────────────────────────────┬────────────────────────────────┘ │
│                                     │                                  │
│   ┌─────────────────────────────────┴────────────────────────────────┐ │
│   │          Mongoose ODM Data Layer & Central Error Handler         │ │
│   └─────────────────────────────────┬────────────────────────────────┘ │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ Mongoose Connection
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│         Database: MongoDB Atlas (Prod) / MongoDB-Memory (Dev)          │
│  Collections: Users, FarmerProfiles, Products, Orders, Carts, Reviews  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### A. The Dynamic Farmer Comparison Engine (`/api/farmers/compare`)
Unlike static or mocked comparison tools, KrishiDirect computes live comparative metrics directly from database state across 2 to 4 selected farmer profiles:
1. **Active Inventory Metrics:** Queries the `Product` collection for active, listed harvest items belonging to each farmer.
2. **Average Farmgate Price:** Calculates `mean(product.price)` across each farmer's current catalog.
3. **Freshness Tracking:** Identifies the `max(product.harvestDate)` among active listings.
4. **Order Fulfilment Velocity:** Computes real historical completion rates and typical delivery windows.
5. **Dynamic Comparative Badges:**
   * `isBestPrice`: Assigned to the farmer with the lowest average product price.
   * `isHighestRating`: Assigned to the farmer with the top weighted customer satisfaction score.
   * `isFastestDelivery`: Assigned to the farm with the fastest turnaround window.
   * `isOrganicVerified`: Assigned to accredited organic producers.
   * `isMostProducts`: Assigned to the grower with the broadest active catalog.

### B. Farm-Grouped Cart & Multi-Farmer Order Engine
Because agricultural produce is dispatched from independent, geographically distinct rural farms:
1. **Grouping Logic:** In the consumer basket, items are organized into clusters keyed by `farmerId`.
2. **Fair Delivery Compensation:** Each farm cluster calculates its own localized delivery charge (flat ₹40 baseline) to directly reimburse local field transportation.
3. **Atomic Stock & Multi-Order Creation:** When placing an order containing crops from multiple growers, the backend executes atomic inventory decrement checks. If valid, separate `Order` documents are created per grower, each with a unique order number (`KRD-YYYY-XXXX`), tracking history, and independent status transitions.

### C. Security & Authorization
1. **JWT Verification:** All protected routes validate Bearer tokens signed with a 256-bit secret.
2. **Strict RBAC:** Middleware explicitly verifies the requester's role (`customer`, `farmer`, `admin`).
3. **Ownership Guard:** Farmers can only edit or delete their own inventory and advance status on orders containing their own farm products.