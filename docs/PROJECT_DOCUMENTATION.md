# 🚀 AyurSaathi – Blockchain-based Traceability & Fair Marketplace for Ayurvedic Herbs

---

## 📌 Overview

**AyurSaathi** is a blockchain-enabled supply chain transparency and fair marketplace platform for the Ayurvedic herbs ecosystem.  
It ensures:

- 🌿 **Authenticity** — herbs traced from farm to consumer  
- 🔗 **Blockchain Traceability** — immutable, tamper-proof history  
- ⚖️ **Fair Pricing** — farmers receive verified government-set rates  
- 🧪 **Verified Quality** — lab-tested and certified batches  
- 🔍 **QR Transparency** — full provenance visible to end users  

This documentation describes the **architecture, folder structure, component system, models, utilities, and API endpoints** of the project.

---

# 🗂️ 1. Project Structure

src/
│
├── app/
│ ├── admin/
│ ├── admin-login/
│ ├── api/
│ ├── batchid/
│ ├── blog/
│ ├── explore/
│ ├── herbslib/
│ ├── id/
│ ├── labid/
│ ├── login/
│ ├── manuld/
│ ├── marketplace/
│ ├── otp/
│ ├── register/
│ ├── layout.js
│ └── page.js
│
├── components/
├── lib/
├── models/
└── public/


---

# 🎨 2. Components Documentation

## 📁 `components/Admin/`
Admin dashboard UI components.

## 📁 `components/ExploreComp/`
UI components for the Explore section.

## 📁 `components/FarmerDashboard/`
Dashboard for farmers — batch uploads, activity display.

## 📁 `components/labDashboard/`
Lab workflow UI — test entry, report upload.

## 📁 `components/ManufactureDashboard/`
Manufacturer processing & batch management UI.

## 📁 `components/marketplace/`
Marketplace UI components.

## 📁 `components/Otp/`
OTP input and resend UI.

## 📁 `components/UserDashboard/`
General authenticated user dashboard.

---

## ⭐ Common Reusable Components

| Component | Description |
|----------|-------------|
| `Blog.jsx` | Blog listing interface |
| `ChatbotAssistant.jsx` | Floating AI assistant |
| `Cropinfo.jsx` | Crop info renderer |
| `Footer.jsx` | Global footer |
| Home Components (`Home_1.jsx`, etc.) | Landing page sections |
| `ImageSlider.jsx` | Carousel/slider |
| `Index.jsx` | Wrapper layout |
| `Landingpage.jsx` | Main landing page |
| `Login.jsx` | Login UI |
| `Navbar.jsx` | Navigation bar |
| `RegisterPage.jsx` | Registration page UI |

---

# 🧠 3. Library Documentation (lib/)

| File | Purpose |
|------|---------|
| `cloudinary.js` | Cloudinary upload handler |
| `cropdetails.js` | Crop metadata utilities |
| `cropinfo.js` | Detailed crop data |
| `db.js` | MongoDB connection initializer |
| `labMailer.js` | Email service for labs |
| `mailer.js` | Common mailer utility |
| `manufacturerMailer.js` | Email sending for manufacturers |
| `mockData.js` | Static mock data |
| `redis.js` | Redis connection + caching |

---

# 🗃️ 4. Data Models (models/)

| Model | Description |
|-------|-------------|
| `AcceptedBatch.js` | Lab-verified accepted batches |
| `AcceptedBatchByManu.js` | Manufacturer-accepted batches |
| `CropUpload.js` | Farmer-uploaded crop batches |
| `Farmer.js` | Farmer profile details |
| `LabApplication.js` | Lab onboarding requests |
| `LabCredential.js` | Lab login model |
| `ManufactureBatch.js` | Manufacturer batch model |
| `ManufacturerApplication.js` | Manufacturer onboarding |
| `ManufacturerCredential.js` | Manufacturer authentication |
| `User.js` | General user profile |

---

# 🔌 5. API Documentation (Structure-Only Version)

> ⚠️ Add method, request body, response format once finalized.  
> This section lists every API endpoint included in the repository.

---

## 📁 `/api/accepted-batch/`
GET /api/accepted-batch
---

## 📁 `/api/analytics/`
GET /api/analytics

## 📁 `/api/approve/`
POST /api/approve

## 📁 `/api/auth/[...nextauth]/`
ALL /api/auth/[...nextauth]

## 📁 `/api/certified-batch/`
GET /api/certified-batch

## 📁 `/api/crops/[uniqueId]/`
GET /api/crops/:uniqueId

## 📁 `/api/cropUploaded/`
POST /api/cropUploaded

## 📁 `/api/labverification/`
POST /api/labverification

## 📁 `/api/login/`
POST /api/login

## 📁 `/api/logout/`
GET /api/logout

## 📁 `/api/manu-approve/`
POST /api/manu-approve

## 📁 `/api/manufacture/`
### Pending Batches
GET /api/manufacture/pending

### Processing Status Update
POST /api/manufacture/processing

### Manufactured Batches
GET /api/manufacture/manufactured

### Partnerships
POST /api/manufacturePartnership

## 📁 `/api/mobile/`
### Login
POST /api/mobile/login

### Register
POST /api/mobile/register
### Send OTP
POST /api/mobile/send-otp/:uniqueId

### Verify OTP
POST /api/mobile/verify-otp/:uniqueId

## 📁 `/api/partnership/`
POST /api/partnership

## 📁 `/api/profile/`
GET /api/profile

## 📁 `/api/public/batch/`
### Batch Status
GET /api/public/batch/batchStatus/:batchId

## 📁 `/api/register/`
### User Registration
POST /api/register

### Resend OTP
POST /api/register/resend-otp/:uniqueId

### Send OTP
POST /api/register/send-otp/:uniqueId

### SMS Webhook
POST /api/register/sms-webhook

### Get User Info
GET /api/register/user/:uniqueId

### Verify OTP
POST /api/register/verify-otp/:uniqueId

### Verify Token
POST /api/register/verify-token

# 🔐 6. Authentication Flow

User → Login/OTP
↓
Server generates JWT / Session
↓
Middleware validates token
↓
Protected routes (Farmer, Lab, Manufacturer dashboards)


---

# 🧪 8. Testing

Recommended testing workflow:

- Postman Collection for endpoint validation  
- Jest/Mocha for unit tests  
- Mock blockchain interactions for faster test cycles  
- Use sample payloads stored in `mockData.js`

---

# 🚀 9. Deployment Architecture

| Layer | Deployment |
|-------|------------|
| **Frontend** | Vercel |
| **Backend** | Node.js Server / Docker |
| **Blockchain** | Hyperledger Fabric |
| **Database** | MongoDB Atlas |
| **Assets** | Cloudinary |
| **OTP / SMS** | Twilio / Exotel |

---

# 🩺 10. Troubleshooting

| Issue | Resolution |
|-------|------------|
| MongoDB connection failed | Verify `MONGODB_URI` |
| OTP not sending | Check SMS gateway credentials |
| Images not uploading | Validate Cloudinary API keys |
| Protected routes failing | Ensure JWT_SECRET is configured |

---
