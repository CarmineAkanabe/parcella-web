# Parcella Web (`parcella-web`)

Frontend web application for **Parcella**, an escrow-protected local delivery platform connecting customers, drivers, and platform administrators across Cameroon.

Built with **Vue 3** (`<script setup lang="ts">`), **Vuetify 4**, **Pinia**, **Vue Router 5**, **Zod**, **Leaflet**, and **Vite**, following the **Warm Industrial Logistics** aesthetic direction (`Plus Jakarta Sans` + `JetBrains Mono`).

---

## Prerequisites

- **Node.js** `>= 20.x` and **npm**
- **Parcella Backend API** running at `http://localhost:8080/api/v1` (Spring Boot + PostgreSQL/PostGIS)

---

## Environment Variables

For local development, copy `.env.example` to `.env` and set your local values (or configure these variables in your hosting provider such as Vercel for production deployments):

```bash
cp .env.example .env
```

| Variable | Example (Local) | Example (Production / Vercel) | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | `https://api.example.com/api/v1` | Base URL for the Parcella REST API v1 |
| `VITE_NOMINATIM_URL` | `https://nominatim.openstreetmap.org` | `https://nominatim.openstreetmap.org` | Nominatim-compatible geocoding endpoint |
| `VITE_OSM_TILE_URL` | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` | Raster map tile template (`{s}`, `{z}`, `{x}`, `{y}`) |

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts the local Vite dev server with HMR |
| `npm run build` | `vue-tsc -b && vite build` | Type-checks the project and builds for production |
| `npm run preview` | `vite preview` | Previews the production build locally |
| `npm test` | `vitest run` | Runs the Vitest unit test suite once |
| `npm run test:watch` | `vitest` | Runs Vitest in interactive watch mode |
| `npm run typecheck` | `vue-tsc -b` | Runs TypeScript and Vue template type-checking |
