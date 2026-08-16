# ProdSync — AI-Powered Product Intelligence Platform

> **Standardizing, Enriching, and Validating Industrial Commerce Data at Enterprise Scale**

ProdSync transforms messy, inconsistent, and unstructured distributor raw product data into rich, normalized, and search-ready catalog records meeting industrial distribution standards (Unilog / UNSPSC).

---

## 🚀 Key Features

- **15-Stage AI Product Intelligence Pipeline**: End-to-end extraction, brand & manufacturer normalization, multi-tier description building, and physical conflict validation.
- **Google Gemini 3.5 Flash Lite Integration**: High-speed, cost-effective attribute extraction, category inference, and spec enrichment.
- **Real-Time Human-in-the-Loop Review**: Intuitive dashboard to review, edit, accept, or reject AI suggestions and resolved conflicts.
- **Explainable AI Insights**: Transparent attribution with confidence scores and reasoning for every extracted attribute.
- **Strict Real Authentication**: Seamless Google OAuth & Firebase Authentication with zero mock fallbacks.
- **Live Notifications & Real-Time Activity Feeds**: Persistent, database-backed notifications with smart unread indicators.
- **Fast In-Memory Caching & SQLite WAL**: 256MB memory-mapped SQLite with WAL mode for fast local read/write performance.

---

## 🛠️ Architecture & Tech Stack

```
ProdSync/
├── backend/          # FastAPI REST Backend (Python 3.11+)
│   ├── app/
│   │   ├── ai/       # Normalization, prompts, validation & confidence scorers
│   │   ├── api/v1/   # REST API endpoints (Products, Imports, Enrichment, Analytics, etc.)
│   │   ├── azure/    # Unified LLM client (Gemini / Azure OpenAI / fallback)
│   │   ├── core/     # Config, security, logging, cache, exceptions
│   │   ├── db/       # SQLAlchemy async models & session factory
│   │   ├── schemas/  # Pydantic v2 validation models
│   │   └── services/ # Product, Import, Enrichment, Notification, Export services
│   └── tests/        # Automated test suite
└── prodsync/         # Next.js 16 App Router Frontend (React 19 + TypeScript)
    └── src/
        ├── app/      # App Router pages (Dashboard, Products, Enrichment, Validation, Catalogs)
        ├── components/ # Reusable UI components, layout, icons
        ├── contexts/ # React context providers (AuthContext)
        ├── lib/      # Utilities & Firebase configuration
        └── services/ # Live backend-connected API clients
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.11+
- **Git**

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Run FastAPI backend on port 8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd prodsync
npm install
cp .env.local.example .env.local

# Run Next.js on port 3000
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to open the application.

---

## 🧪 Testing

```bash
# Run backend test suite
cd backend
pytest -v
```

---

## 📄 License
MIT License.
