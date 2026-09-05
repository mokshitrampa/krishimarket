# 🌾 Krishi Market — Farmer-to-Consumer Agri Marketplace

A complete, production-grade **Farmer-to-Consumer Agricultural Commerce Platform** connecting regional growers directly with households. Eliminates predatory middleman markups, guarantees farm origin transparency, and provides advanced side-by-side farmer comparisons.

---

## 🚀 Live Demo & Project Highlights

* **Project Root:** `C:\Users\nbhuv\Desktop\farmer-agri-marketplace`
* **Real Full-Stack Architecture:** Node.js, Express, MongoDB (with automatic in-memory dev fallback), React 18, Vite, Tailwind CSS, Lucide React, and Recharts.
* **100% Real Backend Data:** No fake frontend mockups or demo shortcuts. Every action hits live REST endpoints.
* **Side-by-Side Farmer Comparison Matrix:** Compare 2 to 4 growers simultaneously on dynamic database metrics (`/compare-farmers`).
* **Multi-Farmer Order Grouping:** Cart items grouped transparently by independent farmstead with individual delivery compensation.
* **Full Order Lifecycle:** Pending → Confirmed → Preparing → Ready for Dispatch → Out for Delivery → Delivered.

---

## 👥 Real Test Credentials

To ensure complete production authentication without shortcuts or demo switchers, log in with any of these pre-seeded accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| 👑 **Administrator** | `admin@krishidirect.com` | `AdminPass123!` | Full control plane, approvals, dispute mediation |
| 👨‍🌾 **Farmer (Nashik)** | `ramesh.patel@farm.com` | `FarmerPass123!` | Green Valley Organic Farm (Vegetables & Grains) |
| 👨‍🌾 **Farmer (Varanasi)** | `sunita.devi@farm.com` | `FarmerPass123!` | Ganga Basin Natural Produce (Pulses & Spices) |
| 👨‍🌾 **Farmer (Jalandhar)**| `gurpreet.singh@farm.com`| `FarmerPass123!` | Doaba Golden Harvest Farms (Wheat & Mustard) |
| 👨‍🌾 **Farmer (Thanjavur)**| `m.selvam@farm.com` | `FarmerPass123!` | Cauvery Delta Traditional Paddies (Heirloom Rice) |
| 🧑 **Customer 1** | `priya.sharma@example.com` | `CustomerPass123!` | Mumbai household buyer with active orders |
| 🧑 **Customer 2** | `arun.kumar@example.com` | `CustomerPass123!` | Bengaluru organic produce buyer |

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React 18 (SPA) + Vite + React Router v6
* **Styling:** Tailwind CSS with custom agricultural palette (`forest`, `harvest`, `earth`)
* **Typography:** Merriweather serif headings & Inter clean sans-serif
* **Icons & Charts:** Lucide React icons & Recharts interactive data visualization
* **Deployment Readiness:** Single Page Application route rewrites via `vercel.json`

### Backend
* **Runtime & Framework:** Node.js + Express.js REST API
* **Security:** Helmet, CORS, Express-Rate-Limit, Bcrypt.js password hashing, JWT authentication
* **Database & ODM:** MongoDB with Mongoose
* **Resilience:** Built-in auto-start fallback to `mongodb-memory-server` in local development if local MongoDB daemon is not running!
* **Deployment Readiness:** Render web service configuration

---

## 📦 Installation & Quick Start

### 1. Clone or Open Project Directory
```bash
cd C:\Users\nbhuv\Desktop\farmer-agri-marketplace
```

### 2. Install Root, Frontend, and Backend Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Environment Variables
Both `frontend` and `backend` include pre-configured `.env` files:

* `backend/.env`:
  ```env
  PORT=5000
  NODE_ENV=development
  MONGODB_URI=mongodb://127.0.0.1:27017/agri-marketplace
  JWT_SECRET=super_secure_krishidirect_jwt_secret_key_2026_dev
  CLIENT_URL=http://localhost:5173
  ```
* `frontend/.env`:
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```

### 4. Database Seeding
To populate the database with categories, admin, 13 farmers, 20 customers, 32+ products, orders, and reviews:
```bash
npm run seed
```
*(Note: When running without local MongoDB, the server automatically boots an in-memory MongoDB instance and auto-seeds on first run!)*

### 5. Launch Development Servers Concurrently
```bash
npm run dev
```
* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5000](http://localhost:5000)
* **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧭 Application Routes

### Public Pages
* `/` — Editorial Landing Page with grower spotlights and mission
* `/marketplace` — Agricultural Produce Marketplace with category, price, and organic filters
* `/products/:id` — Product Details with harvest freshness and grower profile link
* `/farmers` — Verified Grower Directory
* `/farmers/:id` — Farmer Storefront & Soil Practices
* `/compare-farmers` — Side-by-Side 2-4 Farmer Comparison Matrix
* `/how-it-works` — Consumer & Farmer Journey Workflow
* `/about` — Krishi Market Purpose & Supply Chain Ethics
* `/login` — Secure JWT Login
* `/register/customer` — Customer Onboarding
* `/register/farmer` — Farmer Application & Land Credentials

### Customer Portal (`/customer/*`)
* `/customer/dashboard` — Order telemetry, active delivery tracker, saved growers
* `/customer/orders` — Orders list with status tabs, dispute raising, and rating reviews
* `/customer/orders/:id` — Interactive multi-step order timeline
* `/customer/saved-farmers` — Bookmarked growers
* `/customer/cart` — Produce basket grouped by independent farmstead
* `/customer/checkout` — Delivery address, morning/evening slot, and payment mode

### Farmer Hub (`/farmer/*`)
* `/farmer/dashboard` — Revenue, incoming orders, and low-stock alerts
* `/farmer/products` — Harvest crop management with Add/Edit modal
* `/farmer/orders` — Incoming orders with status transition controls
* `/farmer/analytics` — Monthly revenue Recharts and top crops
* `/farmer/profile` — Storefront details, certifications, and delivery windows

### Admin Operations (`/admin/*`)
* `/admin/dashboard` — Platform telemetry, GMV charts, category distribution
* `/admin/approvals` — Farmer application audits (Approve / Reject / Suspend)
* `/admin/farmers` — All growers with account status controls
* `/admin/customers` — Customer accounts registry
* `/admin/products` — Platform-wide listing moderation
* `/admin/categories` — Crop category taxonomy management
* `/admin/orders` — Platform-wide order inspection
* `/admin/reviews` — Review moderation (approve / hide)
* `/admin/disputes` — Dispute resolution desk
* `/admin/analytics` — Macro logistics and cancellation rate analytics

---

## ⚖️ License
Released under the MIT License. Built with pride for regional agricultural transparency.