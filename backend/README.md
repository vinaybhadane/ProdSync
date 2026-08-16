# ProdSync — Production-Ready Azure Backend

Production-ready, secure, and scalable backend for **ProdSync**, an AI-powered Product Intelligence platform for industrial commerce.

Built with **FastAPI**, **Pydantic v2**, **SQLAlchemy 2.0**, **Azure OpenAI**, **Azure Blob Storage**, **Azure AI Document Intelligence**, **Azure Service Bus**, and **Firebase Authentication**.

---

## Architecture Overview

```text
User / Next.js Frontend
          ↓ (Firebase ID Token)
FastAPI Backend (Azure Container Apps)
          ├── Firebase Admin Auth (Server Token Verification)
          ├── Multi-Tenant Tenant Isolation & RBAC
          ├── PostgreSQL Database (Transactional Catalog & Attributes)
          ├── Azure Blob Storage (Document Storage & Direct SAS Uploads)
          ├── Azure Service Bus (Asynchronous Document Processing Queues)
          │
          └── AI Product Intelligence Pipeline
                ├── 1. Document Extraction & OCR (Azure AI Document Intelligence)
                ├── 2. Product Detection & Extraction (Azure OpenAI)
                ├── 3. Unit & Text Normalization Engine
                ├── 4. Rule & Physical Validation Engine
                ├── 5. Cross-Source Multi-Document Conflict Detection
                ├── 6. Conservative AI Enrichment Engine
                ├── 7. Deterministic Confidence & Data Quality Scorer
                ├── 8. Prompt Injection Guard & Output Guardrails
                └── 9. Field-Level Provenance & Explainable AI Insights
```

---

## Technology Stack

- **Framework**: FastAPI (Python 3.11+)
- **Validation**: Pydantic v2
- **ORM / Database**: SQLAlchemy 2.0 Async (PostgreSQL + asyncpg, SQLite fallback)
- **Identity**: Firebase Authentication (Server-side Admin SDK verification)
- **Cloud Infrastructure**:
  - Azure Container Apps
  - Azure Database for PostgreSQL
  - Azure Blob Storage
  - Azure Service Bus
  - Azure AI Document Intelligence
  - Azure OpenAI (GPT-4o)
  - Azure Key Vault
  - Azure Application Insights

---

## Directory Structure

```text
backend/
├── app/
│   ├── main.py                  # FastAPI entrypoint, lifespan, CORS, middleware
│   ├── api/
│   │   ├── dependencies.py      # Auth & DB dependencies
│   │   ├── router.py            # Master API v1 router
│   │   └── v1/                  # Versioned API routes
│   │       ├── auth.py          # /auth/me, /auth/sync, /auth/logout
│   │       ├── users.py         # /users/me
│   │       ├── organizations.py # /organizations/current
│   │       ├── catalogs.py      # /catalogs CRUD & statistics
│   │       ├── products.py      # /products CRUD, intelligence, bulk actions
│   │       ├── imports.py       # /imports, SAS direct upload URL generator
│   │       ├── processing.py    # /processing job monitoring & pipeline
│   │       ├── validation.py    # /validation/issues, conflict resolution
│   │       ├── enrichment.py    # /enrichment/suggestions, human review
│   │       ├── analytics.py     # /analytics/overview, trends, metrics
│   │       ├── notifications.py # /notifications
│   │       ├── exports.py       # /exports/products (CSV, XLSX, JSON)
│   │       └── health.py        # /health, /health/live, /health/ready
│   ├── core/                    # Config, Firebase, security, exceptions, logging
│   ├── db/                      # SQLAlchemy models, session, base
│   ├── schemas/                 # Pydantic v2 request/response schemas
│   ├── services/                # Business logic & repository services
│   ├── ai/                      # Extraction, Normalization, Validation, Confidence
│   ├── azure/                   # Blob, Service Bus, Document Intel, OpenAI clients
│   └── utils/                   # SSRF protection, hashing, pagination
├── scripts/
│   └── seed_demo_data.py        # Demo dataset seeder
├── tests/                       # Automated unit & integration tests
├── Dockerfile                   # Production container running as non-root user
├── docker-compose.yml           # Local multi-service environment
├── requirements.txt             # Pinned Python dependencies
└── pyproject.toml               # Project metadata & pytest configuration
```

---

## Getting Started

### 1. Install Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```powershell
cp .env.example .env
```

### 3. Seed Demo Data

```powershell
python -m scripts.seed_demo_data
```

### 4. Run Development Server

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI documentation will be available at `http://localhost:8000/docs`.

### 5. Run Automated Tests

```powershell
pytest tests/ -v
```
