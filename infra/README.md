# ProdSync — Azure Deployment Guide

> Full-stack Azure deployment for the ProdSync AI Product Intelligence Platform.  
> **Backend**: FastAPI on Azure Container Apps | **Frontend**: Next.js on Azure Static Web Apps

---

## Architecture

```
                     ┌─────────────────────────────────────────┐
                     │           Azure (eastus region)          │
                     │                                         │
  Users ────────────▶│  Azure Static Web Apps (Next.js)        │
                     │         │                               │
                     │         ▼                               │
                     │  Azure Container Apps (FastAPI)          │
                     │         │                               │
                     │  ┌──────┼───────────────────────┐       │
                     │  │      │                       │       │
                     │  ▼      ▼                       ▼       │
                     │  PostgreSQL  Blob Storage  Service Bus  │
                     │                                         │
                     │  Key Vault · App Insights · ACR         │
                     └─────────────────────────────────────────┘
```

---

## Prerequisites

| Tool | Install Command | Required |
|------|----------------|---------|
| Azure CLI | `winget install Microsoft.AzureCLI` | ✅ |
| Docker Desktop | [docker.com](https://docker.com) | ✅ |
| Git | `winget install Git.Git` | ✅ |
| Azure Subscription | [portal.azure.com](https://portal.azure.com) | ✅ |

---

## Step 1 — One-Command Deploy (Recommended)

This script provisions all infrastructure AND deploys your app:

```powershell
# 1. Login to Azure
az login

# 2. Run the deploy script
.\infra\scripts\deploy.ps1 -ResourceGroup "prodsync-rg" -Location "eastus"
```

The script will:
1. ✅ Create the Resource Group
2. ✅ Deploy all Azure resources via Bicep (takes ~8-10 min)
3. ✅ Build & push the Docker image to Azure Container Registry
4. ✅ Deploy the backend to Azure Container Apps
5. ✅ Prompt you to add secrets to Key Vault
6. ✅ Run a health check on the backend

---

## Step 2 — Manual Deploy (Alternative)

### 2a. Provision Infrastructure

```powershell
# Create resource group
az group create --name prodsync-rg --location eastus

# Deploy all Azure resources
az deployment group create `
  --resource-group prodsync-rg `
  --template-file infra/main.bicep `
  --parameters postgresAdminPassword="YourStrongPass123!" `
  --query "properties.outputs"
```

### 2b. Build & Push Docker Image

```powershell
# Login to ACR (replace with your ACR name from Bicep output)
az acr login --name prodsyncacrproduction

# Build image
docker build -t prodsyncacrproduction.azurecr.io/prodsync-backend:latest ./backend

# Push
docker push prodsyncacrproduction.azurecr.io/prodsync-backend:latest
```

### 2c. Update Container App

```powershell
az containerapp update `
  --name prodsync-production-backend `
  --resource-group prodsync-rg `
  --image prodsyncacrproduction.azurecr.io/prodsync-backend:latest
```

---

## Step 3 — Set Up Secrets

Go to **Azure Portal → Key Vault → prodsync-production-kv → Secrets** and add:

| Secret Name | Description |
|---|---|
| `firebase-service-account-json` | Full JSON content of Firebase service account key |
| `azure-openai-api-key` | Azure OpenAI API key |
| `azure-openai-endpoint` | Azure OpenAI endpoint URL |
| `azure-doc-intelligence-key` | Azure Document Intelligence API key |
| `azure-doc-intelligence-endpoint` | Document Intelligence endpoint URL |
| `gemini-api-key` | Google Gemini API key |
| `secret-key` | Auto-generated JWT secret key (created by deploy script) |

Then add them as **environment variables** to your Container App:

```powershell
az containerapp secret set `
  --name prodsync-production-backend `
  --resource-group prodsync-rg `
  --secrets "firebase-json=YOUR_FIREBASE_JSON"

az containerapp update `
  --name prodsync-production-backend `
  --resource-group prodsync-rg `
  --set-env-vars "FIREBASE_SERVICE_ACCOUNT_JSON=secretref:firebase-json"
```

---

## Step 4 — Set Up CI/CD (GitHub Actions)

### 4a. Create Azure Service Principal for GitHub

```powershell
# Replace YOUR-SUBSCRIPTION-ID with your subscription ID
az ad sp create-for-rbac `
  --name "prodsync-github-actions" `
  --role contributor `
  --scopes "/subscriptions/YOUR-SUBSCRIPTION-ID/resourceGroups/prodsync-rg" `
  --sdk-auth
```

Copy the JSON output — you'll need it for GitHub secrets.

### 4b. Add GitHub Secrets

Go to **GitHub → Your Repo → Settings → Secrets and Variables → Actions** and add:

**Backend secrets:**
| Secret | Value |
|---|---|
| `AZURE_CREDENTIALS` | Full JSON from `az ad sp create-for-rbac` above |
| `AZURE_RESOURCE_GROUP` | `prodsync-rg` |
| `AZURE_CONTAINER_REGISTRY` | `prodsyncacrproduction` |
| `AZURE_CONTAINER_APP_NAME` | `prodsync-production-backend` |
| `AZURE_CONTAINER_APP_ENV` | `prodsync-production-cae` |

**Frontend secrets:**
| Secret | Value |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | From Azure Portal → Static Web App → Manage token |
| `NEXT_PUBLIC_API_URL` | `https://prodsync-production-backend.REGION.azurecontainerapps.io` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `prodsync06.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `prodsync06` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

### 4c. Push to GitHub

```bash
git add .
git commit -m "feat: add Azure deployment infrastructure"
git push origin main
```

GitHub Actions will automatically deploy both frontend and backend!

---

## Step 5 — Database Migration

Your app auto-creates tables on startup via `init_db()`. For production with PostgreSQL:

```powershell
# If using Alembic, run migrations via a one-off Container App job:
az containerapp job create `
  --name prodsync-migrate `
  --resource-group prodsync-rg `
  --environment prodsync-production-cae `
  --trigger-type Manual `
  --image prodsyncacrproduction.azurecr.io/prodsync-backend:latest `
  --command "alembic" "upgrade" "head"
```

---

## Verify Deployment

After deploy, test these URLs:

| Endpoint | Expected |
|---|---|
| `https://YOUR-BACKEND.azurecontainerapps.io/health` | `{"status": "ok"}` |
| `https://YOUR-BACKEND.azurecontainerapps.io/docs` | FastAPI Swagger UI |
| `https://YOUR-FRONTEND.azurestaticapps.net` | ProdSync app loads |

---

## Monitor & Logs

```powershell
# Stream backend logs
az containerapp logs show `
  --name prodsync-production-backend `
  --resource-group prodsync-rg `
  --follow

# View in Azure Application Insights (portal)
# Portal → Application Insights → prodsync-production-ai → Live Metrics
```

---

## Cost Estimate (Production Minimum)

| Service | Tier | Est. Monthly |
|---|---|---|
| Azure Static Web Apps | Free | $0 |
| Azure Container Apps | Consumption | ~$0–5 |
| Azure Container Registry | Basic | ~$5 |
| Azure PostgreSQL Flexible | Burstable B1ms | ~$13 |
| Azure Blob Storage | Standard LRS | ~$1–2 |
| Azure Service Bus | Basic | ~$0.05 |
| Azure Key Vault | Standard | ~$0.10 |
| Azure App Insights | First 5GB free | ~$0–2 |
| **Total** | | **~$20–27/month** |

---

## Files Created

```
ProdSync/
├── infra/
│   ├── main.bicep              ← Provisions ALL Azure resources
│   ├── parameters.json         ← Deployment parameters
│   └── scripts/
│       └── deploy.ps1          ← One-command deploy script
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml  ← Backend CI/CD
│       └── deploy-frontend.yml ← Frontend CI/CD
├── backend/
│   └── .env.azure.example      ← Azure env var reference
└── prodsync/
    └── .env.azure.example      ← Frontend Azure env reference
```
