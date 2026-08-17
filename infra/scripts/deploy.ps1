# ============================================================
# ProdSync — Azure One-Command Deploy Script (PowerShell)
# ============================================================
# Prerequisites:
#   - Azure CLI installed (winget install Microsoft.AzureCLI)
#   - Docker Desktop running
#   - az login completed
#   - Fill in the variables below
#
# Usage:
#   .\infra\scripts\deploy.ps1
# ============================================================

param(
    [string]$Environment        = "production",
    [string]$ResourceGroup      = "prodsync-rg",
    [string]$Location           = "eastus",
    [string]$ImageTag           = "latest",
    [string]$PostgresPassword   = "",     # Set via $env:POSTGRES_PASSWORD or pass as argument
    [string]$SubscriptionId     = ""      # Leave empty to use current subscription
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ─────────────────────────────────────────────────────────────
# 0. Helpers
# ─────────────────────────────────────────────────────────────
function Write-Step([string]$msg) {
    Write-Host "`n>>> $msg" -ForegroundColor Cyan
}
function Write-Success([string]$msg) {
    Write-Host "    ✓ $msg" -ForegroundColor Green
}
function Write-Warn([string]$msg) {
    Write-Host "    ⚠ $msg" -ForegroundColor Yellow
}

# ─────────────────────────────────────────────────────────────
# 1. Validate prerequisites
# ─────────────────────────────────────────────────────────────
Write-Step "Checking prerequisites..."

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI not found. Install it: winget install Microsoft.AzureCLI"
    exit 1
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker not found. Install Docker Desktop from https://docker.com"
    exit 1
}

# Resolve Postgres password
if (-not $PostgresPassword) {
    $PostgresPassword = $env:POSTGRES_PASSWORD
}
if (-not $PostgresPassword) {
    $PostgresPassword = Read-Host -Prompt "Enter PostgreSQL admin password (min 8 chars, mixed case + digit)" -AsSecureString |
        ConvertFrom-SecureString -AsPlainText
}
if ($PostgresPassword.Length -lt 8) {
    Write-Error "Password must be at least 8 characters."
    exit 1
}

Write-Success "Prerequisites OK"

# ─────────────────────────────────────────────────────────────
# 2. Set Azure subscription
# ─────────────────────────────────────────────────────────────
Write-Step "Setting Azure subscription..."

if ($SubscriptionId) {
    az account set --subscription $SubscriptionId
}
$currentSub = az account show --query name -o tsv
Write-Success "Using subscription: $currentSub"

# ─────────────────────────────────────────────────────────────
# 3. Create Resource Group
# ─────────────────────────────────────────────────────────────
Write-Step "Creating resource group: $ResourceGroup in $Location..."

az group create `
    --name $ResourceGroup `
    --location $Location `
    --output none

Write-Success "Resource group ready"

# ─────────────────────────────────────────────────────────────
# 4. Deploy Azure Infrastructure via Bicep
# ─────────────────────────────────────────────────────────────
Write-Step "Deploying Azure infrastructure via Bicep (this takes ~5-10 minutes)..."

$deploymentOutput = az deployment group create `
    --resource-group $ResourceGroup `
    --template-file "$PSScriptRoot\..\main.bicep" `
    --parameters environment=$Environment `
                 location=$Location `
                 postgresAdminPassword=$PostgresPassword `
                 imageTag=$ImageTag `
    --query "properties.outputs" `
    --output json | ConvertFrom-Json

if ($LASTEXITCODE -ne 0) {
    Write-Error "Bicep deployment failed. Check the Azure portal for details."
    exit 1
}

# Extract outputs
$acrLoginServer     = $deploymentOutput.acrLoginServer.value
$acrName            = $deploymentOutput.acrName.value
$backendAppName     = $deploymentOutput.backendAppName.value
$containerEnvName   = $deploymentOutput.containerAppsEnvName.value
$backendUrl         = $deploymentOutput.backendUrl.value
$frontendUrl        = $deploymentOutput.frontendUrl.value
$keyVaultName       = $deploymentOutput.keyVaultName.value
$staticWebAppName   = $deploymentOutput.staticWebAppName.value

Write-Success "Infrastructure deployed!"
Write-Host "    ACR:      $acrLoginServer" -ForegroundColor Gray
Write-Host "    Backend:  $backendUrl" -ForegroundColor Gray
Write-Host "    Frontend: $frontendUrl" -ForegroundColor Gray

# ─────────────────────────────────────────────────────────────
# 5. Build & Push Docker Image to ACR
# ─────────────────────────────────────────────────────────────
Write-Step "Building and pushing backend Docker image to $acrLoginServer..."

$backendDockerfile = Resolve-Path "$PSScriptRoot\..\..\backend"
$imageName = "$acrLoginServer/prodsync-backend:$ImageTag"

# Login to ACR
az acr login --name $acrName --output none

# Build image
docker build -t $imageName -f "$backendDockerfile\Dockerfile" $backendDockerfile
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed. Check Dockerfile at backend/Dockerfile."
    exit 1
}

# Push image
docker push $imageName
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker push failed. Ensure you're logged into ACR."
    exit 1
}

Write-Success "Docker image pushed: $imageName"

# ─────────────────────────────────────────────────────────────
# 6. Update Container App with new image
# ─────────────────────────────────────────────────────────────
Write-Step "Updating Azure Container App with new image revision..."

az containerapp update `
    --name $backendAppName `
    --resource-group $ResourceGroup `
    --image $imageName `
    --output none

Write-Success "Container App updated — new revision active"

# ─────────────────────────────────────────────────────────────
# 7. Prompt for secrets to add to Key Vault
# ─────────────────────────────────────────────────────────────
Write-Step "Setting up secrets in Key Vault: $keyVaultName"
Write-Warn "You will be prompted for optional secrets. Press Enter to skip any."

$secrets = @{
    "firebase-service-account-json" = "Firebase service account JSON (paste as single line, or press Enter to skip)"
    "firebase-credentials-path"     = "Firebase credentials file path (or press Enter to skip)"
    "azure-openai-api-key"          = "Azure OpenAI API Key (or press Enter to skip)"
    "azure-openai-endpoint"         = "Azure OpenAI endpoint URL (or press Enter to skip)"
    "azure-doc-intelligence-key"    = "Azure Document Intelligence API Key (or press Enter to skip)"
    "azure-doc-intelligence-endpoint" = "Azure Document Intelligence endpoint URL (or press Enter to skip)"
    "gemini-api-key"                = "Google Gemini API Key (or press Enter to skip)"
    "secret-key"                    = "App SECRET_KEY for JWT (leave empty to auto-generate)"
}

foreach ($kv in $secrets.GetEnumerator()) {
    $val = Read-Host -Prompt "    $($kv.Value)"
    if ($val) {
        az keyvault secret set `
            --vault-name $keyVaultName `
            --name $kv.Key `
            --value $val `
            --output none
        Write-Success "Stored: $($kv.Key)"
    }
}

# Auto-generate SECRET_KEY if not provided
$existingSecretKey = az keyvault secret show --vault-name $keyVaultName --name "secret-key" --query value -o tsv 2>$null
if (-not $existingSecretKey) {
    $autoKey = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
    az keyvault secret set --vault-name $keyVaultName --name "secret-key" --value $autoKey --output none
    Write-Success "Auto-generated SECRET_KEY stored in Key Vault"
}

# ─────────────────────────────────────────────────────────────
# 8. Health check
# ─────────────────────────────────────────────────────────────
Write-Step "Waiting 30 seconds for backend to become ready..."
Start-Sleep -Seconds 30

try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -TimeoutSec 15
    Write-Success "Backend health check passed: $($health | ConvertTo-Json -Compress)"
} catch {
    Write-Warn "Backend health check failed (may still be starting). Check: $backendUrl/health"
}

# ─────────────────────────────────────────────────────────────
# 9. Summary
# ─────────────────────────────────────────────────────────────
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " ProdSync Azure Deployment Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Backend API:    $backendUrl" -ForegroundColor White
Write-Host " API Docs:       $backendUrl/docs" -ForegroundColor White
Write-Host " Frontend:       $frontendUrl" -ForegroundColor White
Write-Host " Key Vault:      https://portal.azure.com/#resource$(az keyvault show --name $keyVaultName --query id -o tsv)" -ForegroundColor White
Write-Host "`n NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Add NEXT_PUBLIC_API_URL=$backendUrl to Azure Static Web App env vars" -ForegroundColor White
Write-Host "  2. Push code to GitHub to trigger CI/CD (see .github/workflows/)" -ForegroundColor White
Write-Host "  3. Verify Firebase service account is configured in Key Vault" -ForegroundColor White
Write-Host "============================================================`n" -ForegroundColor Cyan
