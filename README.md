# Creator Payout Management System

A backend service built as part of the Faym Backend Assignment to simulate the payout workflow of a creator-commerce platform.

The system manages the complete lifecycle of creator earnings—from sale creation to advance payouts, sale reconciliation, wallet management, and withdrawal processing. The implementation focuses on keeping business logic modular, maintaining a clear separation of concerns, and ensuring payout operations remain consistent and traceable.

---

## Overview

Creators generate earnings through successful sales. Instead of waiting until the final sale confirmation, the platform allows creators to receive an advance payout. Once the sale is reconciled, the remaining payout is either released (Approved) or the advance is recovered (Rejected).

Every monetary movement is recorded separately to maintain a clear transaction history while keeping the creator's wallet balance readily available for withdrawals.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript (ES Modules)

---

# Project Structure

```
src
├── config
│   └── db.js
├── controllers
│   ├── payout.controller.js
│   ├── sale.controller.js
│   └── withdrawal.controller.js
├── models
│   ├── user.model.js
│   ├── sale.model.js
│   ├── payout.model.js
│   └── withdrawal.model.js
├── routes
│   ├── payout.routes.js
│   ├── sale.routes.js
│   └── withdrawal.routes.js
├── services
│   ├── payout.service.js
│   └── withdrawal.service.js
├── app.js
└── server.js
```

---

# Architecture

The project follows a layered architecture to keep responsibilities isolated.

```
                Client

                   │

               Express Routes

                   │

              Controllers

                   │

               Services

                   │

          Mongoose Models

                   │

                MongoDB
```

### Responsibilities

- **Routes** map HTTP endpoints.
- **Controllers** handle request/response.
- **Services** contain all business rules.
- **Models** interact with MongoDB.

Keeping business logic inside services makes the application easier to maintain, extend and test.

---

# Database Design

## User

Stores creator information along with the current withdrawable wallet balance.

| Field | Description |
|------|-------------|
| name | Creator name |
| email | Unique email |
| withdrawableBalance | Current wallet balance |
| lastWithdrawalAt | Timestamp of last withdrawal |

---

## Sale

Represents a creator's earning from a sale.

Additional fields were introduced to safely manage payout processing.

| Field | Description |
|------|-------------|
| userId | Creator reference |
| brand | Brand name |
| earning | Creator earning |
| status | PENDING / APPROVED / REJECTED |
| advancePaid | Prevents duplicate advance payouts |
| advanceAmount | Amount already credited |
| isSettled | Prevents duplicate reconciliation |

The **Sale** collection acts as the source of truth for creator earnings.

---

## Payout

Instead of directly modifying wallet balances without any history, every payout operation creates a corresponding payout record.

This works as a simple transaction ledger for:

- Advance payouts
- Final payouts
- Adjustment recoveries

---

## Withdrawal

Stores creator withdrawal requests independently from wallet transactions.

Supported states:

- PENDING
- SUCCESS
- FAILED

---

# Business Workflow

```
Sale Created
      │
      ▼
Advance Payout (10%)
      │
      ▼
Sale Reconciliation
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Approved  Rejected
 │         │
 ▼         ▼
Final     Adjustment
Payout    Recovery
 │         │
 └────┬────┘
      ▼
Wallet Updated
      │
      ▼
Withdrawal Request
      │
      ▼
Success / Failed Refund
```

---

# API Endpoints

## Sales

### Create Sale

```
POST /api/sales
```

Example

```json
{
    "userId": "<user-id>",
    "brand": "Boat",
    "earning": 500,
    "status": "PENDING"
}
```

---

## Payouts

### Process Advance Payout

```
POST /api/payouts/advance
```

Processes all eligible pending sales and credits 10% advance payout.

---

### Reconcile Sale

```
PUT /api/payouts/reconcile/:saleId
```

Request Body

```json
{
    "status":"APPROVED"
}
```

or

```json
{
    "status":"REJECTED"
}
```

Behavior

- APPROVED → Remaining payout is credited.
- REJECTED → Advance amount is recovered through an adjustment entry.

---

## Withdrawals

### Create Withdrawal

```
POST /api/withdrawals
```

Example

```json
{
    "userId":"<user-id>",
    "amount":300
}
```

---

### Mark Withdrawal Failed

```
PUT /api/withdrawals/:id/fail
```

Refunds the withdrawn amount back to the creator wallet.

---

# Design Decisions

### Service Layer

Business logic is intentionally kept inside the service layer instead of controllers. Controllers only handle HTTP communication while services encapsulate the application logic.

---

### Ledger-Based Payouts

Wallet balance updates are accompanied by payout records instead of directly modifying balances without history. This makes every financial movement traceable.

---

### Duplicate Protection

The system prevents duplicate processing using:

- `advancePaid` for advance payouts.
- `isSettled` for sale reconciliation.

This ensures repeated API calls do not produce duplicate payouts.

---

### Negative Wallet Balance

Negative wallet balances are intentionally allowed.

If an advance payout has already been credited for a sale that is later rejected, the adjustment may reduce the creator's balance below zero. This represents the outstanding amount owed to the platform and allows future payouts to naturally settle the balance.

---

### Withdrawal Restriction

Only one withdrawal is allowed every 24 hours to simulate payout batching and avoid repeated withdrawal requests.

---

# Setup

Clone the repository

```bash
git clone https://github.com/Kamal-Kant11/faym-sde-assignment
```

Install dependencies

```bash
npm install
```

Create a `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the server

```bash
npm run dev
```

---

# Assumptions

- Advance payout percentage is fixed at **10%**.
- Sale reconciliation can happen only once.
- Advance payout is processed only once for a sale.
- Wallet balance can become negative after adjustment recovery.
- Failed withdrawals refund the deducted amount immediately.
- Withdrawal requests are limited to one every 24 hours.

---

## Limitations

To keep the implementation focused on the assignment scope:

- Authentication and authorization are omitted.
- MongoDB transactions are not implemented.
- Input validation is minimal.
- No background scheduler is used for payout jobs.

---

# Author

**Kamal Kant Singhal**

Full Stack Developer | MERN Stack
