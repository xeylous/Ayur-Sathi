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
- Farmers record **geo-tagged collection events** via **mobile app or SMS**.  
- Local language support for ease of use.  
- Events include crop type, weight, location, and timestamp.  

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

### 5. **Consumer Transparency**  
- Customers scan QR → see:  
  - Farmer ID & farm location map  
  - Harvest details & lab certificates  
  - Processing steps & sustainability proofs  
- Products purchasable via **fair marketplace** at verified rates.  

### 6. **Admin Dashboards**  
- Central admin panel for:  
  - Monitoring batches & supply chain health  
  - Generating compliance/export reports  
  - Managing disputes & feedback  

---

## Tech Stack  

| Layer            | Technology |
|------------------|------------|
| **Frontend**     | Next.js 13, React, Tailwind CSS, Framer Motion |
| **Backend**      | Node.js, Express.js |
| **Blockchain**   | Hyperledger Fabric (permissioned ledger) |
| **Database**     | MongoDB (off-chain data & cache) |
| **Communication**| SMS/IVR (Twilio, Exotel) |
| **AI/Services**  | Google Speech-to-Text, Bhashini (IVR/local language) |
| **Auth & OTP**   | JWT, bcrypt, Nodemailer (email), SMS OTP |
| **Deployment**   | Vercel (frontend), Docker (backend), Cloud/On-prem blockchain |

---

##  How It Works (Flow)

1. **Farmer Harvests Crop** → sends details via SMS/app → blockchain logs event.  
2. **Lab Tests Sample** → results + certificate uploaded → blockchain validates.  
3. **Processor Records Steps** → drying, grinding, packaging → blockchain updates.  
4. **Unique QR Code Generated** → added to final batch label.  
5. **Consumer Scans QR** → full provenance displayed → product purchased securely.

##  For More Reference refer to Docs.(/docs)
