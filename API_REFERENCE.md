# Ayur-Sathi API Reference

## Authentication & User Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/register | Register a new user (farmer or lab). Sends OTP for verification. |
| POST | /api/send-otp/[uniqueId] | Send OTP to user’s email for verification/login. |
| POST | /api/resend-otp/[uniqueId] | Resend OTP if not received. |
| POST | /api/verify-otp/[uniqueId] | Verify user OTP and update verification status. |
| POST | /api/login | Log in user, returns JWT token in cookies (`auth_token`). |
| GET  | /api/logout | Log out user by clearing authentication cookies. |
| GET  | /api/verify-token | Check if stored JWT token is valid or expired. |

## Crop Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/cropUploaded | Upload new crop batch (sets status = Pending, generates barcode). |
| GET  | /api/crops/[uniqueId] | Fetch all crop uploads by a specific farmer (JWT auth required). |

## Laboratory Processing
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | /api/labverification | Fetch crop batches assigned to lab user for testing (filter by status). |
| POST  | /api/labverification | Save crop batches which is accepted by the lab for testing. |
| POST | /api/approve | Approve/reject crop batch, upload certificate, update test results. |

## Manufacture Processing
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | /api/manufacture | Fetch crop batches that came for manufacturing unit. |
| POST  | /api/labverification | Save crop batches which is accepted by the lab for testing. |
| POST | /api/approve | Approve/reject crop batch, upload certificate, update test results. |

## Profile Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST  | /api/profile | Fetch and Update profile information of the currently logged-in user (JWT required). |

## Partnership & Integration
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/partnership | Register new partners (labs or buyers) with company and contact info. |

## Cloud & Utility APIs
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET  | /api/signed-url | Generate Cloudinary signed upload URL for images/certificates. |
| POST | /api/sms-webhook | Receive SMS status updates from external SMS provider. |
| GET  | /api/user/[uniqueId] | Fetch public or internal user details (access varies by role). |

## Auth (NextAuth Integration)
| Method | Endpoint | Description |
|--------|---------|-------------|
| Any | /api/auth/[...nextauth] | Handles NextAuth.js authentication flows (Google, Email, OAuth, etc.). |
