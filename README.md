# 🛡️ Suraksha — Women's Safety App

> **Suraksha** (Sanskrit: *सुरक्षा*, meaning *Protection*) is a full-stack, real-time women's safety platform that lets users instantly trigger SOS alerts, share their live location, receive SMS notifications, and connect with police dispatchers — all through a seamless mobile + web experience.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Backend Server](#1-backend-server-suraksha-backend)
  - [2. Police Dashboard](#2-police-dashboard-suraksha-dashboard)
  - [3. User Mobile App](#3-user-mobile-app-suraksha-app)
  - [4. Web Interface](#4-web-interface-suraksha-web)
- [Environment Variables](#-environment-variables)
- [Default Credentials](#-default-credentials-seeded)
- [API Reference](#-api-reference)
- [Socket Events](#-socket-events)
- [Key Features](#-key-features)
- [How It Works — End-to-End Flow](#-how-it-works--end-to-end-flow)
- [Contributing](#-contributing)

---

## 🔍 Overview

Suraksha is a **full-stack safety ecosystem** built across four modules:

| Module | Folder | Role |
|---|---|---|
| **Backend API** | `suraksha-backend` | Core server — authentication, SOS logic, SMS, routing |
| **Police Dashboard** | `suraksha-dashboard` | Real-time web panel for law enforcement dispatchers |
| **Mobile App** | `suraksha-app` | React Native app for end users (women) |
| **Web Interface** | `suraksha-web` | Public-facing web presence |

The system uses **WebSockets** (Socket.io) for real-time communication between the mobile app, backend, and the police dashboard, ensuring zero-delay SOS delivery.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     USER'S PHONE                         │
│              (suraksha-app · React Native)               │
│   Triggers SOS ──────────────────────────────────┐       │
│   Sends live GPS location continuously           │       │
└──────────────────────────────────────────────────┼───────┘
                                                   │ REST + WebSocket
                                                   ▼
┌──────────────────────────────────────────────────────────┐
│                  BACKEND SERVER                          │
│          (suraksha-backend · Node.js + Express)          │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │  MongoDB DB  │  │  Twilio SMS   │  │ Google Maps  │  │
│  │  (Users/SOS) │  │  (Alerts to   │  │ API (Safe    │  │
│  │              │  │   contacts)   │  │  Routing)    │  │
│  └──────────────┘  └───────────────┘  └──────────────┘  │
│                                                          │
│   Broadcasts events via Socket.io ─────────────────┐    │
└────────────────────────────────────────────────────┼────┘
                                                     │ WebSocket
                                                     ▼
┌──────────────────────────────────────────────────────────┐
│               POLICE DASHBOARD                           │
│         (suraksha-dashboard · React + Vite)              │
│  Live map · Incoming SOS alerts · Resolve controls       │
└──────────────────────────────────────────────────────────┘
```

---

## 🧰 Tech Stack

### Backend (`suraksha-backend`)
- **Node.js** + **Express** — REST API server
- **MongoDB** + **Mongoose** — Database for users, SOS events, zones
- **Socket.io** — Real-time bidirectional communication
- **Twilio** — SMS alerts to trusted contacts
- **JSON Web Tokens (JWT)** — Authentication & authorization
- **Google Maps Platform API** — Safe routing with risk assessment

### Police Dashboard (`suraksha-dashboard`)
- **React** (Vite build tool)
- **Leaflet.js** — Interactive live map
- **Socket.io Client** — Real-time SOS feed

### Mobile App (`suraksha-app`)
- **React Native** + **Expo**
- **React Navigation** — Screen routing
- **Expo Location** — GPS tracking
- **Maps integration** — Live location display

### Web (`suraksha-web`)
- Static/React web interface for public access

---

## 📁 Project Structure

```
Suraksha/
│
├── suraksha-backend/          # Node.js REST API + Socket server
│   ├── models/                # Mongoose schemas (User, SOS, Zone)
│   ├── routes/                # Express route handlers
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth (JWT), error handling
│   ├── seed.js                # Database seeder (demo data)
│   └── server.js              # Entry point
│
├── suraksha-dashboard/        # Police web dashboard
│   ├── src/
│   │   ├── components/        # Map, Alert list, etc.
│   │   └── App.jsx            # Root component
│   └── vite.config.js
│
├── suraksha-app/              # React Native mobile app
│   ├── screens/               # Home, SOS, Login, Map screens
│   ├── hooks/                 # Custom hooks (location, socket)
│   └── App.js
│
├── suraksha-web/              # Public web interface
│
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

Make sure the following are installed and configured before running the project:

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | v18+ | Required by all modules |
| **npm** | v9+ | Comes with Node.js |
| **MongoDB** | Latest | Running locally on port `27017`, or use MongoDB Atlas |
| **Expo CLI** | Latest | For running the mobile app |
| **Twilio Account** | — | For SMS alert functionality |
| **Google Maps API Key** | — | For safe route calculation |

> **Tip:** You can install Expo CLI globally with `npm install -g expo-cli`

---

## 🚀 Getting Started

Clone the repository first:

```bash
git clone https://github.com/universal-coder343/Suraksha.git
cd Suraksha
```

Then run each module as described below.

---

### 1. Backend Server (`suraksha-backend`)

The core of the application. Start this **first** before any other module.

```bash
# Step 1: Navigate to backend folder
cd suraksha-backend

# Step 2: Install dependencies
npm install

# Step 3: Create your .env file (see Environment Variables section)

# Step 4: Seed the database with demo users and zones
npm run seed

# Step 5: Start the server
npm start
```

The server will start on **`http://localhost:5000`** by default.

> **What does seeding do?**  
> It creates demo police and user accounts, and populates the database with initial zones for routing. This enables you to log in immediately without manual registration.

---

### 2. Police Dashboard (`suraksha-dashboard`)

A browser-based real-time control panel for police dispatchers to monitor and respond to SOS alerts.

```bash
# Step 1: Navigate to dashboard folder
cd suraksha-dashboard

# Step 2: Install dependencies
npm install

# Step 3: Start Vite dev server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

**Login with the seeded police account:**
- Phone: `9000000001`
- PIN: `police1234`

Once logged in, the dashboard will display a live map that updates in real-time as SOS events come in from mobile users.

---

### 3. User Mobile App (`suraksha-app`)

The React Native app that end users (women) install on their phones.

```bash
# Step 1: Navigate to app folder
cd suraksha-app

# Step 2: Install dependencies
npm install

# Step 3: Start the Expo bundler
npx expo start
```

This will launch the **Expo DevTools** in your browser and a QR code in the terminal.

**Connect your device by one of these methods:**

| Method | How |
|---|---|
| **Expo Go App (Physical Device)** | Install [Expo Go](https://expo.dev/go) on your Android/iOS device and scan the QR code |
| **Android Emulator** | Open Android Studio AVD, then press `a` in the Expo terminal |
| **iOS Simulator** | On macOS with Xcode installed, press `i` in the Expo terminal |

**Login with the seeded user account:**
- Phone: `9000000000`
- Password: `test1234`

---

### 4. Web Interface (`suraksha-web`)

```bash
cd suraksha-web
npm install
npm run dev    # or npm start, depending on the setup
```

---

## 🔐 Environment Variables

Create a `.env` file in each module directory. **Never commit `.env` files to version control.**

### Backend — `suraksha-backend/.env`

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/suraksha

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Twilio SMS (get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Google Maps (get from https://console.cloud.google.com)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# CORS & Links
CLIENT_URL=http://localhost:5173
TRACKING_BASE_URL=http://localhost:5173/track
```

### Police Dashboard — `suraksha-dashboard/.env` *(optional, defaults shown)*

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Mobile App — `suraksha-app/.env` *(optional, defaults shown)*

```env
# Use 10.0.2.2 for Android emulator (maps to your machine's localhost)
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
```

> **Note for physical devices:** Replace `10.0.2.2` with your machine's local IP address (e.g. `192.168.1.5`) so the phone can reach the backend server over your local network.

---

## 🔑 Default Credentials (Seeded)

After running `npm run seed` in the backend:

| Role | Phone | Password / PIN |
|---|---|---|
| **Regular User** | `9000000000` | `test1234` |
| **Police Dispatcher** | `9000000001` | `police1234` |

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a **Bearer JWT token** in the `Authorization` header.

### Authentication

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch the currently logged-in user's profile |

### SOS Alerts

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/sos` | Protected | Trigger a new SOS emergency alert |
| `GET` | `/api/sos` | Police only | Retrieve all active SOS alerts |
| `PATCH` | `/api/sos/:id/location` | Protected | Push a live location update to an active SOS |
| `PATCH` | `/api/sos/:id/resolve` | Police only | Mark an SOS alert as resolved |
| `PATCH` | `/api/sos/:id/cancel` | Protected | User cancels their own SOS (marked safe) |

### Contacts & Routing

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/contacts` | Protected | List trusted emergency contacts |
| `POST` | `/api/contacts` | Protected | Add a new trusted contact |
| `GET` | `/api/route?from=lat,lng&to=lat,lng` | Protected | Get a risk-assessed safe route |

### Example: Trigger SOS

```http
POST /api/sos
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "latitude": 25.5941,
  "longitude": 85.1376
}
```

### Example: Update Live Location

```http
PATCH /api/sos/64abc123.../location
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "latitude": 25.5945,
  "longitude": 85.1380
}
```

---

## 📡 Socket Events

The system uses **Socket.io** for real-time communication between the backend and the police dashboard.

| Event | Direction | Description |
|---|---|---|
| `join_police_room` | Dashboard → Backend | Police dashboard registers to receive broadcast updates |
| `new_sos` | Backend → Dashboard | Fires when a user triggers a new SOS — includes user info and location |
| `sos_location_update` | Backend → Dashboard | Fires on each location update from an active SOS — updates the map pin |
| `sos_resolved` | Backend → Dashboard | Fires when police mark an SOS resolved — removes pin from map |
| `sos_cancelled` | Backend → Dashboard | Fires when a user marks themselves safe — removes pin from map |

### Connecting to the Socket (Dashboard Example)

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.emit("join_police_room");

socket.on("new_sos", (data) => {
  console.log("New SOS from:", data.user.name, "at", data.location);
});

socket.on("sos_location_update", (data) => {
  // Update map marker position
});

socket.on("sos_resolved", ({ sosId }) => {
  // Remove marker from map
});
```

---

## ✨ Key Features

- **One-Tap SOS** — Instantly broadcast an emergency alert with live GPS coordinates from the mobile app.
- **Real-Time Location Tracking** — Continuous live location updates pushed to the police dashboard map while SOS is active.
- **SMS Notifications** — Twilio-powered SMS alerts automatically sent to the user's trusted contacts when an SOS is triggered.
- **Live Police Dashboard** — Browser-based real-time map for dispatchers showing active SOS pins, updated live via WebSocket.
- **Safe Route Calculation** — Google Maps API integration for risk-assessed routing that avoids flagged zones.
- **JWT Authentication** — Secure role-based access control separating regular users from police/admin roles.
- **Trusted Contacts** — Users can pre-register emergency contacts who are automatically notified during an SOS.
- **SOS Resolution Flow** — Police can mark incidents as resolved; users can cancel when they're safe.

---

## 🔄 How It Works — End-to-End Flow

```
1. USER opens the Suraksha app and logs in.

2. USER presses the SOS button.
      └─► POST /api/sos  (sends current GPS coordinates)

3. BACKEND creates an SOS record in MongoDB.
      └─► Emits `new_sos` event via Socket.io → Police Dashboard
      └─► Sends SMS to trusted contacts via Twilio

4. POLICE DASHBOARD receives `new_sos` event.
      └─► Drops a new pin on the Leaflet live map

5. USER's phone continues sending location updates.
      └─► PATCH /api/sos/:id/location  (every few seconds)
      └─► BACKEND emits `sos_location_update` → Dashboard
      └─► Dashboard moves the pin on the map in real-time

6. OUTCOME A — Police Respond:
      └─► Dispatcher clicks "Resolve" on dashboard
      └─► PATCH /api/sos/:id/resolve
      └─► BACKEND emits `sos_resolved` → Dashboard removes pin

   OUTCOME B — User is Safe:
      └─► User cancels the SOS from the app
      └─► PATCH /api/sos/:id/cancel
      └─► BACKEND emits `sos_cancelled` → Dashboard removes pin
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against the `master` branch

Please make sure to test all three modules (backend, dashboard, app) before submitting a PR.

---

## 📄 License

This project is open source. See the repository for license details.

---

<div align="center">
  <strong>Built with ❤️ for women's safety.</strong><br/>
  <em>Suraksha — Because every person deserves to feel safe.</em>
</div>
