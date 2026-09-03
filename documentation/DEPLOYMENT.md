# Deployment Guide — KrishiDirect (Vercel + Render + MongoDB Atlas)

This guide documents the complete deployment process for running KrishiDirect in production.

---

## 1. Architecture Overview
* **Frontend:** React + Vite SPA deployed on **Vercel**
* **Backend:** Express.js REST API deployed on **Render** (Web Service)
* **Database:** **MongoDB Atlas** managed cloud cluster

---

## 2. Database Setup: MongoDB Atlas
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user (e.g. `krishi_admin`) with read/write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` to allow inbound connections from Render.
4. Copy the connection string format:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/krishidirect?retryWrites=true&w=majority
   ```

---

## 3. Backend Deployment: Render
1. Sign in to [Render](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   * **Root Directory:** `server`
   * **Environment:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
4. Set Environment Variables in Render Dashboard:
   | Variable | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `10000` | Injected automatically by Render |
   | `MONGODB_URI` | `<your-mongo-atlas-uri>` | Cloud database connection string |
   | `JWT_SECRET` | `<your-random-64-character-secret>` | Cryptographic signing key |
   | `CLIENT_URL` | `https://krishidirect.vercel.app` | Vercel production frontend origin |
5. Deploy Web Service. Once live, note the generated Render domain:
   `https://krishidirect-api.onrender.com`

---

## 4. Frontend Deployment: Vercel
1. Sign in to [Vercel](https://vercel.com) and import the repository.
2. Configure project settings:
   * **Root Directory:** `client`
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
3. Set Environment Variables in Vercel Dashboard:
   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://krishidirect-api.onrender.com/api` |
4. Deploy. Vercel uses `client/vercel.json` to handle client-side SPA routing rewrites:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 5. Post-Deployment Verification Checklist
* [ ] Public landing page loads with images and editorial branding
* [ ] Customer registration and persistent login work
* [ ] Farmer registration creates pending application
* [ ] Admin logs in with master credentials and audits farmer applications
* [ ] Marketplace filters crops by category, location, and price
* [ ] Side-by-side Farmer Comparison (`/compare-farmers`) displays dynamic statistics
* [ ] Cart groups produce by independent farmstead
* [ ] Order checkout completes with atomic stock decrement
* [ ] Farmer updates order status through lifecycle
* [ ] Customer rates grower and submits reviews