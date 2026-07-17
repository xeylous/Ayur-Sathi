# AyurSaathi – Blockchain-based Traceability & Fair Marketplace for Ayurvedic Herbs  

---

## Overview  
The Ayurvedic herbal supply chain in India is highly fragmented, with issues like adulteration, mislabeling, lack of provenance, and unfair pricing for farmers.  

**AyurSaathi** is a blockchain-powered traceability and fair marketplace platform that ensures:  
- **Authenticity** – herbs tracked from farm to consumer  
- **Transparency** – every stage logged immutably on blockchain  
- **Fair Pricing** – farmers receive government-set rates  
- **Consumer Trust** – QR code reveals complete product provenance  

---

##  Core Features  

### 1. **Farmer Integration**  
- Farmers record **geo-tagged collection events** and upload **crop photos** via their dashboard.  
- Image upload integrated with **Cloudinary pipeline** for secure, optimized storage.
- Auto-detects GPS coordinates during submission.
- Simple, premium dashboard UI themed using the **AyurSaathi brand palette** (`#31572C`, `#4F772D`, etc.).

### 2. **Blockchain Traceability**  
- Uses **permissioned blockchain (Hyperledger Fabric)** for tamper-proof provenance.  
- Smart contracts enforce:  
  - Geo-fencing & seasonal harvesting rules  
  - Quality thresholds (moisture, pesticide, DNA tests)  
  - National Medicinal Plants Board (NMPB) compliance  

### 3. **Quality Assurance**  
- Accredited labs receive automated notifications.  
- Lab results uploaded securely and linked to blockchain.  
- Digital **certificates auto-generated** for each batch.  

### 4. **Processing & Packaging**  
- Every **ProcessingStep** (drying, grinding, storage, formulation) recorded.  
- Unique **QR code generated** per batch.  
- QR attached to product labels before retail/export.  

### 5. **Fair Marketplace & Cart Checkout**  
- Verified processed batches listed directly on the platform with automated discount pricing.
- Complete **e-commerce shopping cart (`/cart`)** interface.
- Customers can add items, select quantities limited by active stock, view price breakdowns (including 5% GST and conditional free delivery), and checkout.
- Automated API verifies inventory levels and securely decrements stock upon checkout.

### 6. **Consumer Transparency**  
- Customers scan QR → see:  
  - Farmer ID, harvest details, crop images, & farm location map  
  - Harvest details & lab certificates  
  - Processing steps & sustainability proofs  

---

## Tech Stack  

| Layer            | Technology |
|------------------|------------|
| **Frontend**     | Next.js, React, Vanilla CSS / Tailwind, Framer Motion |
| **Backend**      | Node.js, Express.js |
| **Blockchain**   | Hyperledger Fabric (permissioned ledger) |
| **Database**     | MongoDB (off-chain data & cache) |
| **Storage**      | Cloudinary (images, certificates, barcodes, & QR codes) |
| **Realtime**     | Pusher (instant client dashboard updates) |
| **Communication**| SMS/IVR (Twilio, Exotel) |
| **AI/Services**  | Google Speech-to-Text, Bhashini (IVR/local language) |
| **Auth & OTP**   | JWT, bcrypt, Nodemailer (email), SMS OTP |
| **Deployment**   | Vercel (frontend), Docker (backend), Cloud/On-prem blockchain |

---

##  How It Works (Flow)

1. **Farmer Harvests Crop & Uploads Photo** → sends details via dashboard → blockchain logs event.  
2. **Lab Tests Sample** → results + certificate uploaded → blockchain validates.  
3. **Processor Records Steps** → drying, grinding, packaging → blockchain updates.  
4. **Unique QR Code Generated** → added to final batch label.  
5. **Batch Listed on Marketplace** → consumer browses, adds to cart, and checks out → stock levels update.
6. **Consumer Scans QR** → full provenance displayed.

##  For More Reference refer to Docs.(/docs) or the Obsidian Vault.
