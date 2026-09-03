# Database Architecture & Entity Relationships — KrishiDirect

## 1. Overview
KrishiDirect utilizes a modular data architecture built with MongoDB and Mongoose. Business logic is decoupled into services and controllers, ensuring that migrating to a relational database (PostgreSQL with Prisma/Sequelize or MySQL) can be accomplished with zero disruptions to the API contracts.

---

## 2. Core Collections & Schemas

### 1. `User`
Stores authentication credentials, core contact information, role assignments, and saved customer addresses.
* `name` (String, required)
* `email` (String, required, unique, lowercase, indexed)
* `phone` (String, required)
* `password` (String, hashed using bcryptjs with salt factor 10)
* `role` (String, enum: `['customer', 'farmer', 'admin']`, default: `'customer'`)
* `avatar` (String)
* `status` (String, enum: `['active', 'suspended']`, default: `'active'`)
* `addresses` (Array of sub-documents: street, city, district, state, pincode, isDefault)

### 2. `FarmerProfile`
Extends the `User` document for growers with farmstead identity, agronomic methods, and verification status.
* `user` (ObjectId, ref: `User`, unique, indexed)
* `farmName` (String, required)
* `description` (String)
* `location`, `district`, `state`, `pincode` (String, indexed for regional filtering)
* `cropTypes` (Array of Strings: Vegetables, Fruits, Grains, etc.)
* `farmingMethod` (String, enum: `['Organic', 'Natural / Permaculture', 'Conventional', 'Hydroponic', 'Mixed']`)
* `organicCertified` (Boolean)
* `certifications` (Array of Strings: NPOP India, PGS-India, etc.)
* `yearsExperience`, `farmSizeAcres` (Number)
* `verificationStatus` (String, enum: `['pending', 'approved', 'rejected', 'suspended']`, default: `'pending'`)
* `rating` (Number, dynamic average), `reviewCount` (Number)
* `fulfilmentRate` (Number, default 98)
* `typicalDeliveryDays`, `minimumOrder`, `deliveryOptions`

### 3. `Product`
Represents farmgate agricultural items listed directly by growers.
* `farmer` (ObjectId, ref: `User`, required, indexed)
* `farmerProfile` (ObjectId, ref: `FarmerProfile`)
* `name` (String, required)
* `category` (String, required, indexed)
* `description` (String)
* `price` (Number, required, min: 0)
* `unit` (String, e.g. kg, bunch, litre, pack)
* `stock` (Number, required, min: 0, atomically decremented upon order placement)
* `images` (Array of URLs)
* `harvestDate` (Date, default: Date.now)
* `expectedFreshnessDays` (Number, default: 7)
* `farmingMethod`, `organic` (Boolean)
* `available` (Boolean, default: true)

### 4. `Order`
Immutable transaction and fulfillment record. If a consumer checks out items from multiple growers, independent `Order` documents are created per grower to maintain clean logistics separation.
* `orderNumber` (String, unique, format: `KRD-YYYY-XXXX`)
* `customer` (ObjectId, ref: `User`, required, indexed)
* `farmer` (ObjectId, ref: `User`, required, indexed)
* `farmerProfile` (ObjectId, ref: `FarmerProfile`)
* `items` (Array: product, name, price, quantity, unit, image)
* `subtotal`, `deliveryFee`, `total` (Number)
* `deliveryAddress` (Object: street, city, district, state, pincode, contactNumber)
* `deliverySlot` (String: Morning 7-10 AM or Evening 4-8 PM)
* `paymentMethod`, `paymentStatus` (`'pending'` | `'paid'`)
* `status` (`'Pending'` → `'Confirmed'` → `'Preparing'` → `'Ready for Dispatch'` → `'Out for Delivery'` → `'Delivered'` | `'Cancelled'`)
* `statusHistory` (Array of `{ status, updatedAt, note }`)

### 5. `Review`
Customer ratings and testimonials submitted for delivered orders.
* `customer`, `farmer`, `product`, `order` (ObjectIds)
* `rating` (Number, 1 to 5)
* `comment` (String, required)
* `status` (`'approved'` | `'hidden'`)

### 6. `Dispute`
Platform mediation record for reported delivery or freshness concerns.
* `order`, `customer`, `farmer` (ObjectIds)
* `reason` (`'Missing item'`, `'Poor quality'`, `'Wrong quantity'`, `'Damaged produce'`, `'Delivery problem'`, `'Other'`)
* `description` (String)
* `status` (`'open'` | `'under_review'` | `'resolved'` | `'rejected'`)
* `adminNote` (String)

---

## 3. Future Relational Migration Blueprint
Should the database be migrated to PostgreSQL:
* `users` table maps directly to `User`.
* `farmer_profiles` table with foreign key `user_id REFERENCES users(id) ON DELETE CASCADE`.
* `products` table with foreign key `farmer_id REFERENCES users(id)`.
* `orders` and `order_items` tables with normalized foreign keys.