# CoolRides Frontend

React 18 + TypeScript + Vite + Tailwind + React Router + Zustand + React Query + React Hook Form/Zod scaffold for the CoolRides ride-sharing platform (passenger, rider, admin).

## Setup

```bash
cd frontend
npm install
npm run dev
```

Environment variables (`frontend/.env.example`):

- `VITE_API_BASE_URL` – backend HTTP base URL
- `VITE_WS_URL` – WebSocket URL for live ride updates

## Scripts

- `npm run dev` – start dev server
- `npm run build` – type-check and build
- `npm run test` – vitest + RTL
- `npm run lint` – ESLint

## API expectations

The frontend calls these backend endpoints (mocked in code with Axios clients):

- `POST /auth/login`, `POST /auth/signup`
- `GET /rides`, `POST /rides`
- `GET /vehicles`
- `POST /pricing/estimate`
- `GET /payments`
- `GET /admin/drivers`, `GET /admin/users`

JWT is attached via `Authorization: Bearer <token>` from localStorage. Replace the `useMap` hook with real Google Maps/Mapbox integration when keys are available.
