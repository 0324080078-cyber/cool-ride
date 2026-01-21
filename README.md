# CoolRides Frontend

Monorepo root for the CoolRides frontend. The app lives in `frontend/` and is built with React 18, TypeScript, Vite, Tailwind, React Router, Zustand, React Query, React Hook Form + Zod.

## Quickstart

```bash
./setup-frontend.sh
cd frontend
npm run dev
```

Environment (`.env.example` provided in root and `frontend/`):

- `VITE_API_BASE_URL` – backend base URL
- `VITE_WS_URL` – WebSocket URL

## Scripts (run in frontend/)

- `npm run dev` – start dev server
- `npm run build` – type-check and build
- `npm run test` – vitest + React Testing Library
- `npm run lint` – ESLint

## Backend contract

- Auth: `POST /auth/login`, `POST /auth/signup`
- Rides: `GET /rides`, `POST /rides`
- Vehicles: `GET /vehicles`
- Pricing: `POST /pricing/estimate`
- Payments: `GET /payments`
- Admin: `GET /admin/drivers`, `GET /admin/users`

JWT is read from localStorage and sent as `Authorization: Bearer <token>`. Map rendering uses a placeholder hook; swap in Google Maps/Mapbox SDK inside `useMap`.
