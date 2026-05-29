# KB Garage — Auto Repair Shop Management System

> A full-stack web application for managing garage operations — from customer records and service bookings to employee management and order tracking.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database](#database)

---

## Overview

KB Garage is a garage management platform with a decoupled architecture — a **Node.js/Express REST API** on the backend and a **React 18** frontend. It covers the full lifecycle of a repair shop's daily operations: registering customers, tracking vehicles, scheduling services, managing employees, and processing orders.

---

## Features

### Backend

- RESTful API built with Express, with CORS and JSON middleware
- PostgreSQL/Supabase integration via `pg`
- JWT-based authentication with `jsonwebtoken`
- Password hashing with `bcrypt`
- Environment-based configuration with `dotenv`

**API Endpoints:**

| Resource         | Description                      |
| ---------------- | -------------------------------- |
| `/auth`          | Login and token management       |
| `/customers`     | Customer registration and lookup |
| `/employees`     | Employee records and management  |
| `/vehicles`      | Vehicle registration and history |
| `/services`      | Service catalog and management   |
| `/orders`        | Order creation and tracking      |
| `/installations` | Installation workflow handling   |

### Frontend

- React 18 with React Router for client-side navigation
- Bootstrap-based responsive UI
- Admin dashboard and service management screens
- Authentication flow and protected routes
- Context API for global state management

---

## Tech Stack

| Layer    | Technology                                           |
| -------- | ---------------------------------------------------- |
| Runtime  | Node.js 18+                                          |
| Backend  | Express.js, `pg`, `jsonwebtoken`, `bcrypt`, `dotenv` |
| Frontend | React 18, React Router DOM, React Bootstrap          |
| Database | PostgreSQL (Supabase-compatible)                     |

---

## Project Structure

```
kb-garage/
├── backend/
│   ├── app.js                  # Express app entry point
│   ├── package.json
│   ├── config/                 # Database configuration
│   ├── controllers/            # Route handler functions
│   ├── routes/                 # API route definitions
│   ├── services/               # Business logic layer
│   └── sql/                    # Database setup scripts
│
└── frontend/
    ├── public/                 # Static assets
    └── src/
        ├── markup/             # Reusable page components
        ├── services/           # API service wrappers
        └── Context/            # React context providers
```

---

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js 18+](https://nodejs.org/) and npm
- A PostgreSQL database (or a [Supabase](https://supabase.com/) project)

---

## Getting Started

Clone the repository and install dependencies for both services.

```bash
# Clone the repo
git clone https://github.com/your-org/kb-garage.git
cd kb-garage
```

**Install backend dependencies:**

```bash
cd backend
npm install
```

**Install frontend dependencies:**

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@host:port/database
```

| Variable       | Description                                        |
| -------------- | -------------------------------------------------- |
| `PORT`         | Port the API server listens on                     |
| `FRONTEND_URL` | Allowed origin for CORS (your React dev URL)       |
| `DATABASE_URL` | PostgreSQL connection string (Supabase-compatible) |

---

## Running the Application

Start both services in separate terminal windows.

**Start the backend API:**

```bash
cd backend
node app.js
# Server running at http://localhost:5000
```

**Start the frontend:**

```bash
cd frontend
npm start
# App running at http://localhost:3000
```

---

## Database

The backend connects to PostgreSQL using the `DATABASE_URL` connection string. SQL setup scripts and schema assets are located in `backend/sql/`. Run these scripts against your database before starting the server for the first time.

---

_Built as a garage management platform for small-to-medium auto repair shops._
