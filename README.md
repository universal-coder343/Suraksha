<<<<<<< HEAD
# Suraksha_1.0
=======
# Suraksha - Women's Safety App

Welcome to Suraksha! This project is a complete full-stack women's safety application consisting of:
1. **Node.js Backend** (Express, MongoDB, Socket.io, Twilio SMS)
2. **React Dashboard** (Vite, Leaflet, Socket.io client) for Police Dispatchers
3. **React Native Mobile App** (Expo, React Navigation, Maps, Live Location) for Users

## Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (running locally on port 27017 or a cloud Atlas instance)
- **Twilio Account** (for SMS alerts)
- **Google Maps Platform** API Key (for Safe Routing in backend)

## How to Run Locally

### 1. Backend Server (`suraksha-backend`)
1. Navigate to the folder: `cd suraksha-backend`
2. Run `npm install`
3. Make sure MongoDB is running locally.
4. Rename `.env.example` to `.env` and fill the keys.
   - For demo, you can leave Twilio/Google keys empty. It will log to console instead of failing.
5. Seed the database with initial users and zones:
   ```bash
   npm run seed
   ```
6. Start the server:
   ```bash
   npm start
   ```

### 2. Police Dashboard (`suraksha-dashboard`)
1. Navigate to the folder: `cd suraksha-dashboard`
2. Run `npm install`
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the browser link (usually `http://localhost:5173`).
5. Login with seeded police account:
   - Phone: `9000000001`
   - PIN: `police1234`

### 3. User Mobile App (`suraksha-app`)
1. Navigate to the folder: `cd suraksha-app`
2. Run `npm install`
3. Start the Expo bundler:
   ```bash
   npx expo start
   ```
4. Connect via Android Emulator/iOS Simulator or the Expo Go mobile app.
5. Login with seeded user account:
   - Phone: `9000000000`
   - Password: `test1234`

## Environment Variables

### Backend `.env`
- `PORT`: (5000)
- `MONGODB_URI`: (mongodb://localhost:27017/suraksha)
- `JWT_SECRET`: (your secure secret)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `GOOGLE_MAPS_API_KEY`
- `CLIENT_URL` (dashboard link)
- `TRACKING_BASE_URL` (dynamic live tracking link)

### Dashboard `.env` (Optional, defaults set)
- `VITE_API_URL`=http://localhost:5000/api
- `VITE_SOCKET_URL`=http://localhost:5000

### Mobile App `.env` (Optional, defaults set)
- `EXPO_PUBLIC_API_URL`=http://10.0.2.2:5000/api (android localhost)

## API Endpoints Reference

| Route | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Create new user account |
| `/api/auth/login` | POST | Public | Login |
| `/api/auth/me` | GET | Protected | Get own profile |
| `/api/sos` | POST | Protected | Trigger new SOS Event |
| `/api/sos` | GET | Police | Get active SOS alerts |
| `/api/sos/:id/location` | PATCH | Protected | Update live location of active SOS |
| `/api/sos/:id/resolve` | PATCH | Police | Mark SOS as resolved |
| `/api/sos/:id/cancel` | PATCH | Protected | User cancels SOS |
| `/api/contacts` | GET/POST | Protected | Manage trusted contacts |
| `/api/route?from=x&to=y`| GET | Protected | Calculate risk-assessed safe route |

## Socket Events

| Event Name | Emitter | Listener | Description |
|---|---|---|---|
| `join_police_room` | Dashboard | Backend | Police dashboard joins broadcast room |
| `new_sos` | Backend | Dashboard | Broadcasting new incoming alert |
| `sos_location_update` | Backend | Dashboard | Push live map location updates |
| `sos_resolved` | Backend | Dashboard | Alert was resolved, remove from map |
| `sos_cancelled` | Backend | Dashboard | User marked safe, remove from map |

## Hackathon Demo Script

1. **Start Backend & DB**: Show the `npm start` succeeding.
2. **Open Dashboard**: Log in as a police operator. Keep the map open on half the screen.
3. **Open Mobile App**: Log in as User on the other half of the screen.
4. **Setup**: Go to User App -> Contacts. Add a contact (e.g., Mom).
5. **Safe Routing**: Go to User Map. Type anything in search. Show the blue polyline drawn around red zones securely taking you through Green zones.
6. **Trigger SOS**: Click the giant red SOS floating button (or shake device on Expo Go physically).
7. **Observe Dashboard**: Immediately see the left panel update with a red alert, and the map automatically slide-over and plot a pulsing Red Marker.
8. **Live Track**: Click "Track" on the Dashboard alert. As the emulator changes location coords, see the pin move on the police dashboard.
9. **Resolve**: On the mobile app, click "Cancel SOS". Observe the Dashboard auto-dismiss the alert and disappear from the map.
10. **Conclusion**: Show the Stats Bar on the dashboard updating the counts.
>>>>>>> 94b3b365 (Initial commit)
