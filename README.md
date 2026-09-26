# FitTrack AI — Premium AI Fitness Platform

A production-style full-stack fitness tracking platform with:
- Node.js + Express + MongoDB/Mongoose REST API
- JWT authentication + bcrypt password hashing
- Google Gemini AI recommendation/insight service
- React + Vite frontend
- React Three Fiber 3D hero scene with animated fitness orb
- Framer Motion micro-interactions
- Recharts analytics dashboard
- Workout CRUD, search/filtering, protected routes
- Responsive premium dark UI

## Run

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```
Set `MONGO_URI`, `JWT_SECRET`, and optionally `GEMINI_API_KEY` in `.env`.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal.

If Gemini is not configured, the API returns a safe local fallback recommendation so the demo still works.

## API
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- GET/POST `/api/workouts`
- GET/PUT/DELETE `/api/workouts/:id`
- GET `/api/workouts/search?q=`
- GET `/api/analytics/summary`
- POST `/api/ai/recommend`
- POST `/api/ai/insights`

## Production notes
Use HTTPS, a managed MongoDB deployment, secret storage, rate limiting, request validation, logging/observability, secure cookie/token strategy, and a reverse proxy before public deployment. AI-generated fitness guidance is informational and should not replace professional medical advice.
