# AyurSaathi – Blockchain-based Traceability & Fair Marketplace for Ayurvedic Herbs
 
## Overview
 
The Ayurvedic herbal supply chain in India is highly fragmented, with issues like adulteration, mislabeling, lack of provenance, and unfair pricing for farmers.
 
**AyurSaathi** is a blockchain-powered traceability and fair marketplace platform that ensures:
 
- **Authenticity** – herbs tracked from farm to consumer
- **Transparency** – every stage logged immutably on blockchain
- **Fair Pricing** – farmers receive government-set rates
- **Consumer Trust** – QR code reveals complete product provenance
---
 
## Core Features
 
### 1. Farmer Integration
- Farmers record **geo-tagged collection events** and upload **crop photos** via their dashboard.
- Image upload integrated with the **Cloudinary pipeline** for secure, optimized storage.
- Auto-detects GPS coordinates during submission.
- Simple, premium dashboard UI themed using the **AyurSaathi brand palette** (`#31572C`, `#4F772D`, etc.).
### 2. Blockchain Traceability
- Uses **permissioned blockchain (Hyperledger Fabric)** for tamper-proof provenance.
- Smart contracts enforce:
  - Geo-fencing & seasonal harvesting rules
  - Quality thresholds (moisture, pesticide, DNA tests)
  - National Medicinal Plants Board (NMPB) compliance
### 3. Quality Assurance
- Accredited labs receive automated notifications.
- Lab results uploaded securely and linked to blockchain.
- Digital **certificates auto-generated** for each batch.
### 4. Processing & Packaging
- Every **ProcessingStep** (drying, grinding, storage, formulation) recorded.
- Unique **QR code** generated per batch.
- QR attached to product labels before retail/export.
### 5. Fair Marketplace & Cart Checkout
- Verified processed batches listed directly on the platform with automated discount pricing.
- Complete **e-commerce shopping cart** (`/cart`) interface.
- Customers can add items, select quantities limited by active stock, view price breakdowns (including 5% GST and conditional free delivery), and check out.
- Automated API verifies inventory levels and securely decrements stock upon checkout.
### 6. Consumer Transparency
Customers scan a QR code to see:
- Farmer ID, harvest details, crop images, and farm location map
- Harvest details & lab certificates
- Processing steps & sustainability proofs
---
 
## Tech Stack
 
| Layer             | Technology |
|-------------------|------------|
| **Frontend**      | Next.js, React, Vanilla CSS / Tailwind, Framer Motion |
| **Backend**       | Node.js, Express.js |
| **Blockchain**    | Hyperledger Fabric (permissioned ledger) |
| **Database**      | MongoDB (off-chain data & cache) |
| **Storage**       | Cloudinary (images, certificates, barcodes, & QR codes) |
| **Realtime**      | Pusher (instant client dashboard updates) |
| **Communication** | SMS/IVR (Twilio, Exotel) |
| **AI/Services**   | Google Speech-to-Text, Bhashini (IVR/local language) |
| **Auth & OTP**    | JWT, bcrypt, Nodemailer (email), SMS OTP |
| **Deployment**    | Vercel (frontend), Docker (backend), Cloud/On-prem blockchain |
 
---
 
## How It Works (Flow)
 
1. **Farmer harvests crop & uploads photo** → sends details via dashboard → blockchain logs event.
2. **Lab tests sample** → results + certificate uploaded → blockchain validates.
3. **Processor records steps** → drying, grinding, packaging → blockchain updates.
4. **Unique QR code generated** → added to final batch label.
5. **Batch listed on marketplace** → consumer browses, adds to cart, and checks out → stock levels update.
6. **Consumer scans QR** → full provenance displayed.
---
 
## Getting Started / Installation
 
### Prerequisites
- Node.js 18+ and npm/yarn
- Docker & Docker Compose (for backend services and Hyperledger Fabric network)
- MongoDB instance (local or Atlas)
- Cloudinary account (API key, secret, cloud name)
- Twilio/Exotel account (for SMS/IVR features)
- Pusher account (app ID, key, secret, cluster)
### 1. Clone the repository
```bash
git clone https://github.com/<your-org>/ayursaathi.git
cd ayursaathi
```
 
### 2. Install dependencies
```bash
# Frontend
cd frontend
npm install
 
# Backend
cd ../backend
npm install
```
 
### 3. Configure environment variables
Create a `.env` file in both `/frontend` and `/backend` based on the provided `.env.example` files. Typical variables include:
 
```env
# Backend
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=
 
# Frontend
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
```
 
### 4. Start the Hyperledger Fabric network
```bash
cd blockchain
docker-compose up -d
./scripts/deploy-chaincode.sh
```
 
### 5. Run the backend
```bash
cd backend
npm run dev
```
 
### 6. Run the frontend
```bash
cd frontend
npm run dev
```
 
The app should now be running at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API), assuming default ports.
 
### 7. Seed sample data (optional)
```bash
cd backend
npm run seed
```
 
---
 
## Project Structure
```
ayursaathi/
├── frontend/        # Next.js app (dashboard, marketplace, cart, QR scan pages)
├── backend/          # Express API (auth, batches, orders, lab integration)
├── blockchain/        # Hyperledger Fabric network config & chaincode
├── docs/               # Additional documentation
└── README.md
```
 
---
 
## Live Demo
[ayur-sathi.vercel.app](https://ayur-sathi.vercel.app/)
 
## Further Reference
See the [Docs](/docs) folder or the Obsidian Vault for detailed documentation.
 
## License
Add your license here (e.g., MIT, Apache 2.0).
