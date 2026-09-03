# Product Requirements Document (PRD) — KrishiDirect

## 1. Executive Summary
**KrishiDirect** is a modern, production-grade Farmer-to-Consumer Agricultural Commerce platform designed to eliminate multi-tier middlemen, prevent agricultural distress selling, and empower consumers with 100% transparent, direct access to regional farmers.

---

## 2. Problem Statement
Traditional agricultural supply chains across India and emerging markets suffer from deep structural friction:
1. **Middlemen Exploitation:** Farmers historically realize only 20% to 30% of the final retail price paid by consumers, with commission agents and APMC intermediaries capturing up to 70%.
2. **Loss of Freshness and Nutritional Value:** Multiple handling points cause 4 to 7 days of transit delay, necessitating artificial wax coatings, calcium carbide ripening, and heavy refrigeration.
3. **Information Asymmetry:** Consumers cannot verify which farm produced their food, the harvest date, or whether synthetic pesticides were applied.
4. **Disorganized Market Access:** Smallholder farmers lack digital storefronts to build repeat customer relationships and showcase generational stewardship.

---

## 3. Core Objectives
* **Boost Farmer Incomes:** Ensure farmers retain 85%+ of the gross transaction value.
* **Side-by-Side Comparison:** Empower consumers to compare 2 to 4 growers simultaneously on price, rating, harvest date, certifications, and delivery windows.
* **Farmgate Transparency:** Clearly surface farmer profiles, land holdings, soil practices, and verified badges.
* **Streamlined Multi-Farmer Dispatch:** Group cart items by individual farm dispatches with independent tracking.

---

## 4. User Personas & Roles
1. **Customer:** Households seeking certified organic or chemical-free fresh produce directly from identifiable growers.
2. **Farmer:** Independent growers and cooperatives seeking a direct digital marketplace to set their own prices and manage harvest orders.
3. **Administrator:** Platform stewards responsible for auditing farmer land documents, verifying certifications, moderating reviews, resolving order disputes, and tracking macro analytics.

---

## 5. Scope & Features
### In-Scope:
* Role-based access control (Customer, Farmer, Admin)
* Dynamic Farmer Comparison engine (`/compare-farmers`)
* Direct-to-farm cart and checkout with farm-grouped logistics
* Real-time order workflow (Pending → Confirmed → Preparing → Ready for Dispatch → Out for Delivery → Delivered)
* Post-delivery rating and review engine
* Dispute resolution desk
* Operational analytics with Recharts visualizations

### Out of Scope (Future Phases):
* International cross-border shipping
* Native mobile apps (Android/iOS)
* AI crop disease detection

---

## 6. Key Performance Indicators (KPIs)
* **GMV (Gross Merchandise Value):** Total direct agricultural transactions processed.
* **Fulfilment Rate:** Percentage of orders harvested and delivered on schedule (target: >95%).
* **Farmer Retention & Repeat Orders:** Measure of recurring household subscriptions.
* **Dispute Rate:** Maintained below 1.5% through transparent customer feedback.