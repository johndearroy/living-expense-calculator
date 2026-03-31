# Living Expense Calculator

A full-stack web application to help UK international students estimate and assess monthly living costs, compared against UKVI (Home Office) maintenance baselines.

**Stack:** Next.js · NestJS · PostgreSQL · Docker

---

## Quick Start (Docker — recommended)

```bash
# 1. Clone the repo
git clone git@github.com:johndearroy/living-expense-calculator.git
cd living-expense-calculator

# 2. No need to create environment file, .env is already there, just copy
cp .env server/.env
cp .env.client client/.env

# 3. Build and start all three containers
sudo docker compose up --build

# 4. Seed the database (run once, in a second terminal)
sudo docker compose exec backend sh
npm run seed
```

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:3000            |
| Backend  | http://localhost:5000            |
| API Docs | http://localhost:5000/api/docs   |
| Database | http://localhost:8080/           |

---

## Local Development (without Docker)

### Prerequisites
- Node.js 25+
- PostgreSQL 14+

### Backend

```bash
cd neonexor_backend
cp .env.example .env        # edit DB credentials
npm install
npm run seed                # seed the database
npm run start:dev           # starts on port 5000
```

### Frontend

```bash
cd client
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev                 # starts on port 3000
```

---

## How to Seed the Database

The seeder clears and re-inserts all cities, presets, and baselines.

**With Docker (after `docker-compose up`):**
```bash
npm run seed
```
OR
```bash
sudo docker compose exec backend sh npm run seed:prod
```

**Without Docker:**
```bash
cd server
npm run seed
```

This seeds **4 cities** — London, Manchester, Birmingham, Edinburgh — each with **3 band presets** (low / typical / high) and **1 baseline row**.

---

## API Endpoint Documentation

Base URL: `http://localhost:3001/api`

Full interactive docs available at `/api/docs` (Swagger UI).

### Cities

| Method | Endpoint                       | Description                              |
|--------|--------------------------------|------------------------------------------|
| GET    | `/cities`                      | List all available cities                |
| GET    | `/cities/:id/preset?band=`     | Get preset values for a city and band    |

**Example:** `GET /api/cities/1/preset?band=typical`

### Baselines

| Method | Endpoint                       | Description                              |
|--------|--------------------------------|------------------------------------------|
| GET    | `/baselines`                   | All UKVI + city minimum baselines        |
| GET    | `/baselines?city_id=1`         | Baseline for a specific city             |

### Calculate

| Method | Endpoint       | Description                                  |
|--------|----------------|----------------------------------------------|
| POST   | `/calculate`   | Submit inputs, receive full calculation result |

**Request body:** JSON with all expense inputs (see Swagger docs for full schema).

**Response includes:**
- UKVI/city baseline comparison + warning flags
- Typical month and first month totals
- Itemised expense breakdown
- Donut chart percentage
- Savings suggestions with monthly saving amounts
- Guidance tips
- Developer sanity checks

### Presets (Admin)

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| PUT    | `/presets/:id`   | Update a city preset  |
| DELETE | `/presets/:id`   | Remove a city preset  |

### HTTP Status Codes

| Code | Meaning                             |
|------|-------------------------------------|
| 200  | OK — request successful             |
| 201  | Created                             |
| 400  | Bad Request — validation failed     |
| 404  | Not Found — city/preset not found   |
| 500  | Internal Server Error               |

---

## Project Structure

```
/
├── client/                  → Next.js frontend (port 3000)
│   ├── src/app/             → App Router pages
│   ├── src/components/      → UI components
│   └── Dockerfile
│
├── server/                  → NestJS backend (port 5000)
│   ├── src/
│   │   ├── calculate/       → Core calculation engine
│   │   ├── cities/          → City list + preset retrieval
│   │   ├── presets/         → Preset CRUD
│   │   ├── baselines/       → UKVI + city minimum data
│   │   └── entities/        → TypeORM database entities
│   ├── db/seeds/            → Seed script + data
│   └── Dockerfile
│
├── docker-compose.yml       → Orchestrates all 3 containers
├── .env.example             → Root env template
└── README.md
```

---

## Calculation Logic

All calculation is performed server-side in `POST /calculate`.

| Step | Formula |
|------|---------|
| Budget midpoint | `(budget_lower + budget_upper) / 2` |
| Rent share | `midpoint(rent_lower, rent_upper) / people_sharing` |
| Weekly → Monthly | `value × 52 / 12` (accurate year conversion) |
| Amortized cost | `amortized_one_off / amortize_over_months` |
| Typical month | `sum_of_all_recurring × (1 + buffer)` |
| First month | `typical_month + deposit + upfront_one_off` |
| Budget coverage | `(midpoint_budget / typical_month) × 100` |

---

## Assumptions

1. **UKVI baseline** — £1,483/mo for London, £1,334/mo for other UK cities, based on the Home Office 2024 Student visa maintenance requirements (12-month course rate).
2. **City minimum** — Practical floor estimated from Numbeo cost-of-living data and Rightmove/Zoopla median shared room rents (Jan 2025). Not an official figure.
3. **Council tax** — Estimated at £150/mo when not exempt. Full-time students in the UK are exempt; the checkbox reflects this.
4. **Transport pass** — London: £172/mo (Zone 1–2 monthly Travelcard). Manchester: £88 (System One). Birmingham: £80 (Network West Midlands). Edinburgh: £75 (Lothian Buses).
5. **Preset values** — All preset values are illustrative starting points derived from publicly available data. Users should verify current market rates before making financial decisions.
6. **Buffer** — Applied to the recurring monthly subtotal only, not to deposit or upfront one-off costs.
7. **Bills when included in rent** — When "Bills included in rent" is checked, electricity, gas, water, and internet fields are ignored in the calculation.
8. **Food "review" badge** — Triggered when food & drink exceeds 30% of typical monthly total.

---

## Technologies Used

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14, Tailwind CSS, Recharts, React Hook Form |
| Backend   | NestJS 10, TypeORM, class-validator |
| Database  | PostgreSQL 16, Adminer              |
| Infra     | Docker, Docker Compose              |
| API Docs  | Swagger / OpenAPI (auto-generated)  |


### Data source: https://www.numbeo.com/cost-of-living/rankings.jsp

## Limitations:
- Some missing validations