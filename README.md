# Md Abu Faysal Joy — Portfolio (MERN + Admin CMS)

A production-style MERN portfolio: an animated, 3D front end (React Three Fiber + Framer Motion) backed by an
Express/MongoDB API, with an admin panel where **every piece of content on the site is editable** — no code edits
needed to change a word, a project, a colour or a section.

```
portfolio/
├─ server/          Express + Mongoose API (auth, CRUD, uploads, contact inbox)
│  └─ src/{models,routes,lib,middleware}
├─ client/          React + Vite SPA (public site + /admin control room)
│  └─ src/{sections,pages,components,three,admin,lib}
├─ Dockerfile       Single-image build (API serves the built client)
└─ docker-compose.yml
```

## Quick start

```bash
npm install
npm run dev          # API on :5050, site on :5173
```

Open:
- Site — http://localhost:5173
- Admin — http://localhost:5173/admin (`admin@faysaljoy.dev` / `Admin@12345`, set in `server/.env`)

The seed runs automatically on first boot: profile, 9 projects, 43 skills, experience, services and testimonials.
Re-seed from scratch with `npm run seed -w server -- --force`.

> **Change the admin password** in `server/.env` (or from Settings → Change admin password) before deploying.

### Database

`server/.env` → `MONGODB_URI`. If MongoDB is unreachable the API automatically falls back to a JSON file store
(`server/data/db.json`) so the site and admin panel keep working — the dashboard shows which driver is active.

## What the admin panel controls

| Section | Edits |
|---|---|
| Profile & hero | name, headline, rotating roles, summary, about, stats, social links, SEO meta |
| Projects | full case studies: problem, approach, highlights, features, stack, metrics, links, accent colour, featured/draft, order |
| Skills | name, group, level, order (groups drive the tabbed skills section) |
| Experience | roles, education, dates, achievements, stack |
| Services | title, icon, description, bullets |
| Testimonials | quote, author, company, rating |
| Inbox | contact-form submissions, read/unread, reply, delete |
| Settings | theme colours (applied live), section visibility, footer note, analytics ID, password change |

## API

Base: `/api/v1` · success `{ data }` · errors `{ error: { code, message, details? } }`

| Method | Route | Auth |
|---|---|---|
| POST | `/auth/login`, `/auth/password` | public / bearer |
| GET | `/site` (everything the home page needs in one call) | public |
| GET/PUT | `/profile`, `/settings` | public read, bearer write |
| GET/POST/PUT/DELETE | `/projects`, `/skills`, `/experience`, `/services`, `/testimonials` | public read, bearer write |
| POST/GET/PUT/DELETE | `/messages` | public create, bearer read/manage |
| POST | `/uploads` (image, 4 MB max) | bearer |
| GET | `/stats`, `/health` | bearer / public |

Security: helmet, CORS allowlist, rate limits on login (20/10 min) and the contact form (15/h), JWT bearer auth,
argon-grade bcrypt hashing (cost 12), server-side validation on every write, image-only uploads with random filenames.

## Front-end highlights

- **3D hero** — React Three Fiber: distorting icosahedron core, orbit rings, floating stack solids, 1 400-point
  starfield, pointer-tracked camera. Lazy-loaded in its own chunk and disabled-by-motion-preference.
- **Motion system** — Framer Motion scroll reveals, shared-layout filter pills, tilt cards with a specular highlight,
  magnetic buttons, trailing cursor, scroll progress bar, page transitions.
- Responsive from 360 px up, logical CSS properties throughout, `prefers-reduced-motion` respected.

## Deploy

**Render + MongoDB Atlas (free):** step-by-step in [DEPLOYMENT.md](DEPLOYMENT.md), which covers both shapes —
front end and API as **two separate services, no Docker** (`render.yaml`, the default) or **one Docker service**
(`render.docker.yaml` + the multi-stage `Dockerfile`). Push to `main` redeploys.

Splitting them needs exactly two env vars: `VITE_API_URL` on the front end (the API's origin, baked in at build
time — see `client/.env.example`) and `CLIENT_ORIGIN` on the API (the site's origin, for CORS), plus
`SERVE_CLIENT=false` so the API stops serving the SPA. Leave `VITE_API_URL` blank and the client calls its own
origin, which is what local dev and the single-service deploy want.

**Locally or on a VPS:**

```bash
docker compose up -d --build     # app + MongoDB, site on :5050
```

Or build manually: `npm run build` then `npm start` (the API serves `client/dist` and falls back to `index.html`
for client-side routes). Behind Nginx, proxy `/` to `:5050`. Set `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
`MONGODB_URI` and `CLIENT_ORIGIN` as environment variables in production — in production the API refuses to
start without a reachable `MONGODB_URI` rather than falling back to the file store.
