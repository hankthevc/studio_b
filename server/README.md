# Studio B Advanced Commerce Backend (Reference)

This lightweight Express server keeps App Store Server credentials off-device and brokers Advanced Commerce API calls for the iOS host.

## Capabilities

- `POST /api/commerce/purchase`
  - Receives `{ slug, metadata }`
  - Initiates Advanced Commerce via your private credentials (stubbed with deterministic success here)
  - Returns `{ slug, status, productId, transactionId }`
- `POST /api/commerce/consumption`
  - Proxies App Store Server API **Send Consumption Information**
- `POST /api/commerce/notifications`
  - Entry point for App Store Server notifications (Transaction updates, revocations, refunds)

## Quick start

```bash
cd server
npm install
cp .env.sample .env   # add Apple credentials + backend JWT secret
npm start
```

Set `STUDIOB_COMMERCE_BACKEND_URL=http://localhost:8787` before running the iOS host so `CommerceManager` calls this server.

> **Security note**  
> The sample implementation signs App Store Server API JWTs with values from `.env`. In production, rotate the key regularly, enforce mTLS/IP filtering, and persist consumption/transaction logs in a database.


