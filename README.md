# Encar MVP — Car Listing Platform

A full-stack MVP that scrapes used car listings from [Encar.com](https://www.encar.com), exposes them via a FastAPI REST API, and displays them in a modern Next.js frontend.

---

## Project Structure

```
encar-mvp/
├── backend/
│   ├── parser.py        # Playwright scraper
│   ├── main.py          # FastAPI app (GET /cars)
│   ├── cars.json        # Scraped data (auto-generated, seed included)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx       # Main listing page (SSR + ISR)
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── Hero.tsx
    │   │   ├── CarsGrid.tsx
    │   │   └── CarCard.tsx
    │   └── lib/
    │       ├── api.ts          # Fetch helpers + types
    │       └── providers.tsx   # TanStack Query provider
    ├── next.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    └── package.json
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browser (Chromium)
playwright install chromium

# Run the scraper (collects ~30 cars from Encar.com → saves to cars.json)
python parser.py

# Start the API server
uvicorn main:app --reload --port 8000
```

The API will be available at: **http://localhost:8000**
- `GET /cars` — returns all parsed cars
- `GET /cars/{index}` — returns a single car by index
- `GET /` — health check

> **Note:** A seed `cars.json` with 20 sample records is included so the frontend
> works even before running the scraper.

---

### 2. Frontend Setup

```bash
cd frontend

# Copy env config
cp .env.example .env.local

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will be available at: **http://localhost:3000**

---

## Daily Data Updates (Cron)

### Linux / macOS

Open your crontab:
```bash
crontab -e
```

Add this line to run the scraper at 3:00 AM daily:
```cron
0 3 * * * /path/to/encar-mvp/backend/.venv/bin/python /path/to/encar-mvp/backend/parser.py >> /tmp/encar-parser.log 2>&1
```

### Windows (Task Scheduler)

1. Open **Task Scheduler** → Create Basic Task
2. Trigger: Daily at 03:00
3. Action: Start a program
   - Program: `C:\path\to\.venv\Scripts\python.exe`
   - Arguments: `C:\path\to\backend\parser.py`

### Alternative: Simple shell script wrapper

```bash
#!/bin/bash
# refresh.sh — call from cron or CI
set -e
cd "$(dirname "$0")/backend"
source .venv/bin/activate
python parser.py
echo "Done: $(date)"
```

---

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Scraper   | Python · Playwright (async)   |
| Backend   | FastAPI · Pydantic · Uvicorn  |
| Data      | JSON file (easily swappable to SQLite/Postgres) |
| Frontend  | Next.js 14 · TypeScript       |
| Styling   | Tailwind CSS                  |
| Data fetch| TanStack Query (client) / Next.js ISR (server) |
| State     | Zustand-ready (providers wired up) |

---

## Deployment

### Backend → Railway

1. Create a new project at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Set the **root directory** to `backend/`
4. Set start command:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add a cron job service with command:
   ```
   python parser.py
   ```
   Schedule: `0 3 * * *`

**Environment variables to set on Railway:**
```
PORT=8000
```

### Frontend → Vercel

1. Import the repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend/`
3. Framework: **Next.js** (auto-detected)
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
   ```
5. Deploy — Vercel handles the rest.

---

## Notes on Encar.com Scraping

Encar uses dynamic JavaScript rendering, so Playwright (headless Chromium) is required.
The parser:
- Navigates to the main listing page
- Waits for `tr.list` rows to appear in the DOM
- Extracts brand, model, year, mileage, price, image URL, and detail link
- Handles pagination to collect up to 30 records
- Saves structured JSON with a timestamp

If Encar changes their DOM structure, update the CSS selectors in `parser.py`.
The selectors to focus on: `.manufacturer`, `.model`, `.year`, `.km`, `.price`, `tr.list`.

---

## API Response Shape

```json
{
  "updated_at": "2025-01-15T03:00:00",
  "count": 20,
  "cars": [
    {
      "brand": "현대",
      "model": "아반떼 CN7",
      "year": "2022",
      "mileage": "32,000km",
      "price": "1,850만원",
      "image": "https://ci.encar.com/...",
      "detail_url": "https://www.encar.com/...",
      "scraped_at": "2025-01-15T03:00:00"
    }
  ]
}
```
# MillionMiles
