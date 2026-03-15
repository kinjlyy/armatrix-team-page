# Armatrix Team Page

A full-stack internship assignment — a polished, production-grade **Team Page** for Armatrix, built with Next.js, FastAPI, and Framer Motion.

---

## Live Preview

| Surface | URL |
|---|---|
| Frontend (Vercel) | `https://armatrix-team.vercel.app` |
| Backend API (Render) | `https://armatrix-api.onrender.com` |
| API Docs (Swagger) | `https://armatrix-api.onrender.com/docs` |

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| **Next.js 14** (App Router) | React framework, routing, ISR |
| **TailwindCSS** | Utility-first styling |
| **Framer Motion** | Animations, transitions, scroll effects |
| **Lucide React** | Icon system |

### Backend
| Tool | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **SQLite** | Lightweight database (via stdlib `sqlite3`) |
| **Pydantic v2** | Request/response validation |
| **Uvicorn** | ASGI server |

---

## Project Structure

```
armatrix-team/
├── backend/
│   ├── main.py            # FastAPI app, CORS, startup
│   ├── models.py          # Pydantic schemas
│   ├── database.py        # SQLite connection + seed data
│   ├── routes/
│   │   └── team.py        # CRUD endpoints
│   ├── requirements.txt
│   ├── Procfile           # Render / Railway start command
│   └── render.yaml        # Render deployment config
│
└── frontend/
    ├── app/
    │   ├── layout.jsx      # Root layout + metadata
    │   ├── page.jsx        # Redirect → /team
    │   ├── globals.css     # Global styles, aurora, skeletons
    │   └── team/
    │       └── page.jsx    # Main Team Page (client component)
    ├── components/
    │   ├── AuroraBackground.jsx  # Mouse-reactive gradient orbs
    │   ├── HeroSection.jsx       # Large display-type hero + scroll indicator
    │   ├── Navbar.jsx            # Sticky nav with scroll-aware blur
    │   ├── TeamGrid.jsx          # Responsive grid + skeleton loaders
    │   ├── TeamCard.jsx          # Interactive card with card-level mouse glow
    │   ├── TeamModal.jsx         # Full-detail modal with AnimatePresence
    │   └── Footer.jsx            # Minimal footer
    ├── lib/
    │   └── api.js          # API helper (fetch wrappers)
    ├── next.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── .env.local.example
```

---

## Local Development

### 1 — Clone

```bash
git clone https://github.com/your-org/armatrix-team.git
cd armatrix-team
```

### 2 — Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API is live at **http://localhost:8000**
Swagger docs at **http://localhost:8000/docs**

The database is auto-created on first run and seeded with 8 team members.

### 3 — Frontend

```bash
cd frontend
cp .env.local.example .env.local
# .env.local already points to http://localhost:8000
npm install
npm run dev
```

Frontend is live at **http://localhost:3000/team**

---

## API Reference

### Base URL
```
https://armatrix-api.onrender.com   (production)
http://localhost:8000               (local)
```

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/team/` | List all team members |
| `GET` | `/team/{id}` | Get one member |
| `POST` | `/team/` | Create member |
| `PUT` | `/team/{id}` | Update member |
| `DELETE` | `/team/{id}` | Delete member |

### Team Member Schema

```json
{
  "id": 1,
  "name": "Aryan Mehta",
  "role": "CEO & Co-Founder",
  "bio": "...",
  "photo_url": "https://...",
  "linkedin_url": "https://linkedin.com/...",
  "github_url": "https://github.com/...",
  "twitter_url": null
}
```

### Example: Create a member

```bash
curl -X POST http://localhost:8000/team/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sam Patel",
    "role": "ML Research Engineer",
    "bio": "Research engineer specialising in model compression.",
    "photo_url": "https://api.dicebear.com/7.x/personas/svg?seed=SamPatel",
    "linkedin_url": "https://linkedin.com/in/sampatel",
    "github_url": "https://github.com/sampatel"
  }'
```

---

## Design Details

### Aurora Background
Three blurred radial gradient orbs (purple, orange, gold) sit behind all content. On `mousemove`, each orb shifts slightly using a lerp-based animation loop (`requestAnimationFrame`). A separate `cursor-light` radial gradient tracks the cursor exactly, creating a soft spotlight effect.

### Mouse-reactive Card Glow
Each `TeamCard` tracks `mousemove` relative to its own bounding rect and writes `--mouse-x` / `--mouse-y` CSS variables. A `radial-gradient` centered at those coordinates is revealed on hover.

### Framer Motion Patterns

| Effect | Implementation |
|---|---|
| Hero words | `staggerChildren` + `skewY` correction |
| Parallax hero | `useScroll` + `useTransform` (y, opacity) |
| Card entrance | `whileInView` with per-row delay (`index % 4`) |
| Card hover lift | `whileHover={{ y: -6 }}` |
| Modal | `AnimatePresence` + scale + y spring |
| Scroll line | Animating `y` on a line element from -100% to 100% |

### Skeleton Loaders
Shown while `isLoading === true`. Eight skeleton cards mirror the exact shape of real cards using the `.skeleton` CSS class (animated `background-position` shimmer).

---

## Deployment

### Backend → Render

1. Push the `backend/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add a **Disk** (path `/data`, 1GB) to persist the SQLite file between deploys
7. Update `database.py` → change `DB_PATH = "/data/armatrix.db"`
8. Deploy — note your `.onrender.com` URL

### Frontend → Vercel

1. Push the `frontend/` folder (or monorepo) to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-api.onrender.com`
5. Deploy

### Railway (alternative backend)

```bash
railway login
cd backend
railway init
railway up
railway variables set PORT=8000
```

---

## Environment Variables

### Frontend (`.env.local`)
| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

---

## Extending

### Add a new field (e.g. `department`)
1. **`backend/models.py`** — add `department: Optional[str] = None` to `TeamMemberBase`
2. **`backend/database.py`** — add column to `CREATE TABLE` and seed INSERT
3. **`frontend/components/TeamCard.jsx`** — render the new field
4. **`frontend/components/TeamModal.jsx`** — render in the modal details

### Replace SQLite with PostgreSQL
1. `pip install asyncpg databases`
2. Replace `database.py` with an async `databases` + `SQLAlchemy Core` setup
3. Update `render.yaml` to add a `PostgreSQL` managed database

---

## License

MIT — built as an Armatrix internship assignment.
