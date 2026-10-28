# Md Abu Faysal Joy
**Full-Stack MERN Engineer & Embedded Systems Builder**
Narsingdi, Dhaka, Bangladesh · mdabufaysaljoy@gmail.com · Available for freelance & full-time roles

[GitHub](https://github.com/mdabufaysaljoy) · [LinkedIn](https://www.linkedin.com/in/mdabufaysaljoy) · [Facebook](https://facebook.com/mdabufaysaljoy) · [Blog](https://mdabufaysaljoy.blogspot.com) · [Email](mailto:mdabufaysaljoy@gmail.com)

**Roles:** MERN Stack Developer · Next.js + TypeScript Engineer · ERP / POS Systems Architect · ESP32 & IoT Developer

**25+** production projects · **4+** years building · **30+** tech in daily use · **12+** hardware builds

## Summary

I design and ship production web platforms end to end — pixel-accurate 3D-grade interfaces on the front, hardened Node.js services, event-driven architecture and cloud infrastructure on the back. I also build the firmware that lets hardware talk to them.

## About

I have spent the last years building commerce and management platforms that real businesses run on: multi-branch POS/ERP suites, multi-vendor e-commerce, learning platforms and content systems. My approach is architecture first — clean module boundaries, typed contracts, append-only ledgers for anything touching money or stock, and observability from day one. Away from the browser I work with ESP32-S3, Arduino and Raspberry Pi, wiring sensors and on-device AI into the same cloud backends, which is how projects like LEO came to life.

## Skills (43)

### Frontend

| Skill | Level |
|---|---|
| React | 95% |
| JavaScript (ES2023) | 95% |
| Tailwind CSS | 94% |
| Next.js | 92% |
| shadcn/ui + Radix | 90% |
| TypeScript | 88% |
| Framer Motion | 88% |
| Redux & TanStack Query | 88% |
| Three.js / R3F | 82% |

### Backend

| Skill | Level |
|---|---|
| Node.js | 94% |
| Express | 93% |
| REST API design | 92% |
| JWT & OAuth2 | 90% |
| Zod validation | 90% |
| Socket.IO / WebSocket | 86% |
| BullMQ / job queues | 84% |
| GraphQL | 72% |

### Database

| Skill | Level |
|---|---|
| MongoDB & Mongoose | 93% |
| Aggregation pipelines | 88% |
| Indexing & query tuning | 85% |
| Redis | 84% |
| PostgreSQL | 76% |

### DevOps & Cloud

| Skill | Level |
|---|---|
| Docker & Compose | 90% |
| Vercel / Render / Railway | 90% |
| CI/CD (GitHub Actions) | 87% |
| Nginx & SSL | 86% |
| Linux VPS ops | 84% |
| AWS (EC2, S3, CloudFront) | 82% |
| Monitoring & logging | 80% |

### Architecture

| Skill | Level |
|---|---|
| System design | 88% |
| Security (OWASP, RBAC) | 88% |
| Event-driven architecture | 86% |
| Multi-tenant SaaS design | 86% |
| Modular monolith / microservices | 85% |
| Caching strategy | 84% |

### Embedded & IoT

| Skill | Level |
|---|---|
| ESP32 / ESP32-S3 | 90% |
| Arduino / PlatformIO | 90% |
| MQTT & BLE | 86% |
| Raspberry Pi | 85% |
| Sensors & motor control | 85% |
| C / C++ firmware | 84% |
| FreeRTOS | 80% |
| Edge AI / TinyML | 75% |

## Featured projects (7)

### 1. LEO — AI-Enhanced Companion Robot
*ESP32-S3 robot with on-device vision, wake-word voice control and an LLM brain in the cloud.*
AI + Robotics · 2025 · Firmware, cloud backend & control dashboard

`featured`

[Source](https://github.com/mdabufaysaljoy)

**Overview.** LEO is a desk companion robot built on the ESP32-S3. It streams camera frames, runs wake-word detection on device, and routes conversation to an LLM service, then expresses answers through servo motion, an animated eye display and TTS audio.

**Problem.** Hobby robots either run everything locally (too weak for real conversation) or stream everything to the cloud (slow, expensive and offline-fragile). LEO needed to feel instant while still being genuinely smart.

**Approach.** A split brain: the ESP32-S3 handles wake word, motion, sensors and the emotion engine locally over FreeRTOS tasks; heavier perception and dialogue go to a Node.js service that talks to vision and LLM providers, with an MQTT/WebSocket channel keeping latency low and a cached offline personality when the network drops.

**Engineering highlights**

- Wake-word + VAD running on-device with ESP-DSP, <400 ms to first motion response
- Dual-core FreeRTOS firmware: perception, motion, audio and telemetry as isolated tasks
- Node.js gateway with MQTT bridge, LLM/vision adapters and conversation memory in MongoDB
- React control room: live camera, telemetry charts, servo calibration and OTA firmware push

**Features**

- OV2640 camera streaming over WebSocket with on-device JPEG framing
- Emotion engine driving a 240x240 animated eye display
- Servo-driven head and arm choreography synced to speech
- Battery, temperature and Wi-Fi telemetry with alert thresholds
- Over-the-air firmware updates from the dashboard

**Stack:** ESP32-S3, C++ / ESP-IDF, FreeRTOS, MQTT, Node.js, WebSocket, MongoDB, React, LLM APIs, TTS / STT

**Architecture:** Edge firmware (ESP32-S3) ⇄ MQTT broker ⇄ Node.js gateway ⇄ LLM / vision adapters ⇄ React control room

**Metrics:** **< 400 ms** wake-to-response · **6 h** uptime on battery · **7** firmware tasks

---

### 2. SuperShop — Web POS & ERP Suite
*Multi-branch retail operating system: POS, inventory ledger, shifts, returns and reporting.*
ERP / POS · 2025 · Full-stack architect & lead developer

`featured`

[Source](https://github.com/mdabufaysaljoy/supershop-web-pos-erp)

**Overview.** A complete retail back office. Cashiers sell on a scan-first POS that prints thermal receipts; managers get branch-aware inventory, purchase orders, shift reconciliation and live profit reporting.

**Problem.** Retailers were juggling spreadsheets, a cash drawer and a disconnected online store, so stock and revenue numbers never agreed.

**Approach.** One modular monolith with a strict money/stock core: every quantity change is an append-only stock movement inside a MongoDB transaction, every sale is idempotent, and every side effect (loyalty, receipts, notifications) runs off an event bus instead of tangled service calls.

**Engineering highlights**

- Append-only stock ledger with atomic $inc + movement row in one transaction
- Idempotent POS sale endpoint — safe on retries, double-clicks and flaky networks
- Role/permission matrix with per-branch scoping enforced on every route
- ESC/POS thermal receipt + barcode label printing via QZ Tray with signed messages
- Shifts with X/Z reports, cash in/out and variance tracking

**Features**

- Scan-first POS with hold/resume, split payments and custom payment methods
- Returns & exchanges with stock restore, refund routing and loyalty reversal
- Purchase orders, suppliers and goods-received flow
- Loyalty engine with configurable earn/redeem rules
- Dashboards: sales by staff, product, category, branch and channel

**Stack:** React, Node.js, Express, MongoDB, Mongoose, Redis, BullMQ, Tailwind, Docker, Nginx

**Architecture:** Modular monolith · controller → service → repo layering · event bus for side effects · adapters for payments, SMS and printing

**Metrics:** **Unlimited** branches supported · **< 120 ms** sale commit time · **80+** permission keys

---

### 3. MultiPOS — Multi-Tenant SaaS Platform
*TypeScript SaaS where every merchant gets an isolated POS workspace, billing and subdomain.*
SaaS Platform · 2025 · Platform architecture & backend

`featured`

[Source](https://github.com/mdabufaysaljoy/multipos-saas)

**Overview.** The SaaS evolution of the POS: tenant provisioning, plan-based feature flags, subscription billing and per-tenant data isolation behind a single deployment.

**Problem.** Running one deployment per shop does not scale — upgrades, migrations and support costs multiply.

**Approach.** A tenant-aware core: resolver middleware maps subdomain → tenant, every query passes through a scope helper, plans toggle feature flags at module boundaries, and migrations run once across all tenants.

**Engineering highlights**

- Tenant resolution + data scoping enforced in a single choke point
- Plan-driven feature flags (`features.loyalty`, `features.branches`) read at module level
- Subscription lifecycle: trial, upgrade, dunning, suspension
- Typed end-to-end with TypeScript and zod contracts shared across apps

**Features**

- Self-serve onboarding with seeded demo data per tenant
- Per-tenant branding, receipt templates and domains
- Usage metering and plan limits
- Admin console for the platform owner

**Stack:** TypeScript, Next.js, Node.js, MongoDB, Redis, zod, Stripe-style billing, Docker, CI/CD

**Architecture:** Multi-tenant monolith · subdomain tenant resolver · shared schema with tenantId scoping · queue workers per tenant

**Metrics:** **Row-level** tenant isolation · **< 30 s** cold onboarding · **100%** type coverage

---

### 4. Multi-Vendor E-Commerce Platform
*Marketplace with vendor dashboards, cart revalidation, payments and order lifecycle.*
E-Commerce · 2024 · Full-stack developer

`featured`

[Source](https://github.com/mdabufaysaljoy/Multi-Vendor-MERN-Stack-E-commerce-project)

**Overview.** A marketplace where independent vendors manage their own catalog, stock and orders while customers shop one unified storefront with search, filters and a fast checkout.

**Problem.** Marketplaces break where money, stock and trust meet: oversells, stale prices and vendor payout disputes.

**Approach.** Server-side cart with price/stock revalidation at every step, order snapshots so history never depends on the live catalog, and a payment adapter layer so gateways can be swapped without touching business code.

**Engineering highlights**

- Server-authoritative cart, merged on login, revalidated at checkout
- Order item snapshots (name, price, tax, variant) for immutable history
- Vendor dashboards with payouts, commissions and fulfilment queues
- SSR product pages with JSON-LD, sitemaps and clean slugs for SEO

**Features**

- Faceted search, filters and sort with suggestion dropdown
- Variant matrix (size/color) with image swapping
- Coupons, campaigns and flash offers
- Order tracking timeline with email/SMS notifications
- Review and rating system with moderation

**Stack:** React, Next.js, Node.js, Express, MongoDB, Stripe, Tailwind, Framer Motion, AWS S3

**Architecture:** Next.js SSR/ISR storefront · Express API · adapter layer for payments, mail and storage · Redis cache

**Metrics:** **98** lighthouse seo · **2** checkout steps · **Unlimited** vendors supported

---

### 5. EduFlow — Learning Management System
*Courses, lessons, quizzes, progress tracking and certificates for instructors and students.*
LMS · 2024 · Full-stack developer

`featured`

[Source](https://github.com/mdabufaysaljoy/college-mern-webapp)

**Overview.** An LMS where instructors build structured courses with video lessons, graded quizzes and assignments, and students track progress toward a verifiable certificate.

**Problem.** Off-the-shelf LMS tools are rigid: grading rules, enrolment flows and certificates rarely match how an institution actually teaches.

**Approach.** A curriculum engine driven by configuration — lesson types, completion rules, grading schemes and certificate templates are data, not code — on top of role-based access for admin, instructor and student.

**Engineering highlights**

- Curriculum builder: sections, lessons, resources and drip scheduling
- Quiz engine with question banks, timers, attempts and auto-grading
- Progress engine computing completion, scores and certificate eligibility
- Secure video delivery with signed URLs and resume-where-you-left-off

**Features**

- Role-based dashboards for admin, instructor and student
- Assignments with file submission and rubric grading
- Discussion threads per lesson
- Enrolment via purchase, invite or cohort import
- Certificates with verification codes

**Stack:** React, Node.js, Express, MongoDB, JWT, Cloudinary, Tailwind, Chart.js

**Architecture:** REST API · role-scoped resources · background jobs for grading, email and certificate generation

**Metrics:** **6** lesson types · **100%** auto-graded · **3** roles

---

### 6. BlockForge — Headless CMS & Page Builder
*Drag-and-drop page builder with a versioned block schema and SSR-ready delivery API.*
CMS · 2024 · Architecture & full-stack build

`featured`

[Source](https://github.com/mdabufaysaljoy)

**Overview.** A CMS where marketing teams compose pages from typed blocks — hero carousels, product rails, FAQs, rich text — and publish with draft/preview/versioning, while the storefront renders the same JSON server-side.

**Problem.** Every content change becoming a developer ticket kills marketing velocity; most builders then produce unmaintainable HTML soup.

**Approach.** A block registry: each block is a schema + renderer + editor panel. Adding a block type needs no router or route change, and pages stay as validated, versioned JSON that both the builder and the SSR storefront consume.

**Engineering highlights**

- Versioned page JSON with draft / publish / rollback and autosave
- dnd-kit canvas with responsive preview and undo/redo
- Sanitised custom HTML blocks (server-side DOMPurify)
- Menus, theme tokens, SEO defaults and redirects managed in-app

**Features**

- Block registry with schema-driven props panels
- Media library with image processing
- Global header/footer builder and announcement bar
- SEO fields, sitemap and robots editor
- Multi-language content fields with fallbacks

**Stack:** React, dnd-kit, Node.js, MongoDB, zod, Next.js, Tailwind, DOMPurify

**Architecture:** Block registry (schema + renderer + editor) · versioned page documents · delivery API consumed by SSR frontend

**Metrics:** **16** core blocks · **Instant** publish time · **~80%** dev tickets saved

---

### 7. SmartGrid — ESP32 IoT Telemetry Platform
*Fleet of ESP32 nodes streaming sensor data to a real-time dashboard with rules and alerts.*
IoT · 2024 · Firmware + backend + dashboard

`featured`

[Source](https://github.com/mdabufaysaljoy)

**Overview.** ESP32 nodes read temperature, humidity, power and motion, publish over MQTT, and a Node.js ingest service stores time-series data that a React dashboard renders live with threshold-based alerting.

**Problem.** Hobby IoT setups fall apart at scale: devices drop off, data gaps go unnoticed and provisioning is manual.

**Approach.** Provisioning tokens and device registry on the backend, last-will-and-testament MQTT messages for instant offline detection, buffered writes on the node for network gaps, and OTA updates pushed per device group.

**Engineering highlights**

- MQTT LWT for sub-second offline detection
- On-device ring buffer replays readings after reconnect
- Rules engine: thresholds → email / SMS / webhook alerts
- Grouped OTA rollout with version pinning and rollback

**Features**

- Device registry with provisioning QR codes
- Live charts, heat maps and historical export
- Relay control (lights, pumps, fans) from the dashboard
- Raspberry Pi edge gateway for LAN-only deployments

**Stack:** ESP32, Arduino / PlatformIO, MQTT, Raspberry Pi, Node.js, MongoDB time-series, React, Recharts, Docker

**Architecture:** ESP32 nodes → MQTT broker → Node.js ingest + rules engine → MongoDB time-series → React dashboard

**Metrics:** **250+** nodes per broker · **< 50 ms** ingest latency · **< 1 s** offline detect

## Other projects (2)

### 8. Campus Suite — College Management Web App
*Admissions, students, courses, results and fees in one MERN application.*
Management System · 2024 · Full-stack developer

[Source](https://github.com/mdabufaysaljoy/The-Ultimate-College-Management-Web-Application-Client)

**Overview.** A college operations platform: admissions pipeline, student records, course registration, result publication, fee collection and notices — each gated by role.

**Problem.** Administrative data lived in paper files and disconnected spreadsheets, making results and dues slow and error-prone.

**Approach.** A normalised domain model with audited state transitions for admissions, results and payments, plus printable PDF transcripts and receipts.

**Engineering highlights**

- Audited state machines for admission and result publication
- Fee ledger with receipts and outstanding-dues reporting
- Printable transcripts and PDF exports
- Notice board with targeted audiences

**Features**

- Student & staff directories
- Course registration with capacity checks
- Attendance tracking
- Result entry with grade rules
- Role-scoped dashboards

**Stack:** React, Node.js, Express, MongoDB, JWT, Tailwind, PDFKit

**Architecture:** REST API · role-based access · audited transitions · PDF generation workers

**Metrics:** **8** modules · **12** report types · **4** roles

---

### 9. PiVision — Raspberry Pi Edge Vision Node
*Raspberry Pi running on-device detection and pushing events, not video, to the cloud.*
Edge AI · 2023 · Edge software & integration

[Source](https://github.com/mdabufaysaljoy)

**Overview.** A Raspberry Pi 4 node runs object detection locally and publishes only events and thumbnails upstream, keeping bandwidth and privacy under control.

**Problem.** Streaming every camera to the cloud is expensive, slow and a privacy problem.

**Approach.** Inference at the edge with a lightweight model, event-only upstream payloads, and a Dockerised deployment so a node can be reflashed and rejoined in minutes.

**Engineering highlights**

- On-device inference with frame skipping and motion gating
- Event payloads + thumbnails instead of continuous video
- Docker Compose deployment with watchdog auto-restart
- Integrates with the SmartGrid dashboard and alert rules

**Features**

- Zone-based detection rules
- Local recording buffer
- Offline-first event queue
- Remote health checks

**Stack:** Raspberry Pi, Python, OpenCV, Docker, MQTT, Node.js, React

**Architecture:** Pi edge inference → event queue → MQTT → Node.js API → dashboard

**Metrics:** **~95%** bandwidth saved · **12 FPS** inference · **Automatic** recovery

## Experience

### Freelance Full-Stack Engineer
**Independent** · Remote · Dhaka, Bangladesh · 2023 — Present

Designing and shipping commerce, ERP and management platforms end to end for clients across retail and education.

- Delivered multi-branch POS/ERP and multi-vendor e-commerce platforms from architecture to deployment
- Introduced append-only stock ledgers and idempotent transactions, eliminating oversell and double-charge classes of bugs
- Set up Dockerised CI/CD pipelines to VPS and cloud, cutting release time from hours to minutes

**Stack:** React, Node.js, MongoDB, Docker, AWS

### Full-Stack Web Developer
**Client Projects & Agencies** · Dhaka, Bangladesh · 2022 — 2023

Built production React/Node applications, marketing sites and dashboards with a focus on performance and SEO.

- Shipped 20+ front-end and full-stack projects with reusable component systems
- Improved Core Web Vitals on client sites through SSR, image optimisation and bundle splitting
- Integrated payment gateways, authentication and third-party APIs

**Stack:** React, Next.js, Express, MongoDB, Tailwind

### Embedded & IoT Developer
**Personal R&D** · Narsingdi, Bangladesh · 2021 — Present

Building ESP32, Arduino and Raspberry Pi systems that connect hardware to the same cloud backends I write.

- Built LEO, an ESP32-S3 companion robot with on-device wake word and cloud LLM dialogue
- Deployed MQTT telemetry fleets with OTA updates and rules-based alerting
- Ran on-device inference on Raspberry Pi to cut upstream bandwidth ~95%

**Stack:** ESP32-S3, C++, FreeRTOS, MQTT, Raspberry Pi

### Computer Science & Engineering
**United International University** · Dhaka, Bangladesh · 2021 — Present · education

Studying CSE with a focus on software architecture, networks and embedded systems.

- Built campus utilities used by fellow students
- Active in programming and robotics project work

## Services

### Full-Stack Product Engineering
From a blank repo to a deployed product: data model, API, interface, infrastructure and handover.

- MERN / Next.js + TypeScript
- Auth, roles and permissions
- Testing and CI/CD pipelines

### ERP, POS & Commerce Platforms
Systems where money and stock must be exactly right — ledgers, transactions, audits and reporting.

- Multi-branch inventory and shifts
- Payments, returns and loyalty
- Thermal receipt & label printing

### System Design & Architecture Review
Scalable structure for teams: module boundaries, event flows, caching, queues and failure handling.

- Modular monolith or microservices
- Event-driven side effects
- Performance and cost tuning

### IoT, Robotics & Edge AI
Firmware and cloud as one product — devices that provision, report, update and recover on their own.

- ESP32 / Arduino / Raspberry Pi
- MQTT telemetry and OTA updates
- On-device inference

### Cloud Deployment & DevOps
Containerised deployments with zero-downtime releases, monitoring, backups and SSL.

- Docker & Compose
- AWS / VPS with Nginx
- GitHub Actions pipelines

### Immersive Front-End Experiences
Interfaces with real motion design: 3D scenes, scroll choreography and interactions that stay fast.

- React Three Fiber scenes
- Framer Motion systems
- 60fps and accessible

## Testimonials

> Our stock numbers finally match reality. The POS is fast enough for a queue at rush hour, and the reports gave us answers we had been guessing at for years.
>
> — **Rashed Karim**, Owner, SuperShop Retail

> Faysal translated a messy brief into a clean architecture and then delivered it. The LMS shipped on time and the code was documented well enough for our team to extend.
>
> — **Nadia Rahman**, Product Manager, EdTech Startup

> Rare to find someone who writes the firmware and the cloud service with the same level of care. Our device fleet has been online without manual intervention for months.
>
> — **Tanvir Hasan**, CTO, IoT Solutions Co.

---

*Exported from the portfolio API on 2026-10-28 · regenerate with `npm run export:content`*
