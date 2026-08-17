// ============================================================
// ProdSync — Azure Infrastructure (main.bicep)
// Provisions all Azure resources needed for production deployment
// Usage: az deployment group create --resource-group prodsync-rg \
//         --template-file infra/main.bicep \
//         --parameters @infra/parameters.json
// ============================================================

@description('Environment name (dev, staging, production)')
@allowed(['dev', 'staging', 'production'])
param environment string = 'production'

@description('Azure region for all resources')
param location string = 'centralindia'

@description('Base name for all resources (e.g. prodsync)')
param appName string = 'prodsync'

@description('PostgreSQL admin username')
param postgresAdminUser string = 'prodsyncadmin'

@description('PostgreSQL admin password — stored in Key Vault after provisioning')
@secure()
param postgresAdminPassword string

@description('Container image tag to deploy (e.g. latest or git SHA)')
param imageTag string = 'latest'

@description('Firebase Project ID')
param firebaseProjectId string = 'prodsync06'

@description('CORS allowed origins for the backend (comma separated)')
param corsOrigins string = '*'

// ============================================================
// Derived naming (all resources use a consistent prefix)
// ============================================================
var prefix = '${appName}-${environment}'
var acrName = replace('${appName}acr${environment}', '-', '')  // ACR names: alphanumeric only
var containerAppsEnvName = '${prefix}-cae'
var backendAppName = '${prefix}-backend'
var postgresServerName = '${prefix}-pg'
var postgresDbName = 'prodsync'
var storageAccountName = replace('${appName}st${environment}', '-', '')
var keyVaultName = '${prefix}-kv'
var appInsightsName = '${prefix}-ai'
var logWorkspaceName = '${prefix}-logs'
var serviceBusNamespaceName = '${prefix}-bus'
// NOTE: Azure Static Web Apps is NOT included here because its metadata region
// (centralus/eastus2) is blocked by the Azure for Students subscription policy.
// The Next.js frontend is deployed separately via GitHub Actions → Azure Static Web Apps action.

// ============================================================
// Log Analytics Workspace (required by Container Apps + AI)
// ============================================================
resource logWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logWorkspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// ============================================================
// Application Insights
// ============================================================
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logWorkspace.id
    RetentionInDays: 30
  }
}

// ============================================================
// Azure Container Registry
// ============================================================
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// ============================================================
// Azure Key Vault
// ============================================================
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    softDeleteRetentionInDays: 7
    enableSoftDelete: true
  }
}

// Store Postgres password in Key Vault
resource kvSecretPostgres 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'postgres-admin-password'
  properties: {
    value: postgresAdminPassword
  }
}

// Store App Insights connection string in Key Vault
resource kvSecretAI 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'appinsights-connection-string'
  properties: {
    value: appInsights.properties.ConnectionString
  }
}

// ============================================================
// Azure Blob Storage
// ============================================================
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storageAccount
  name: 'default'
}

resource containerRaw 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'prod-sync-raw'
  properties: { publicAccess: 'None' }
}

resource containerProcessed 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'prod-sync-processed'
  properties: { publicAccess: 'None' }
}

resource containerExports 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'prod-sync-exports'
  properties: { publicAccess: 'None' }
}

// ============================================================
// Azure Service Bus
// ============================================================
resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' = {
  name: serviceBusNamespaceName
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
}

resource documentProcessingQueue 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' = {
  parent: serviceBusNamespace
  name: 'document-processing'
  properties: {
    maxDeliveryCount: 5
    lockDuration: 'PT5M'
    defaultMessageTimeToLive: 'P1D'
  }
}

// ============================================================
// Azure Database for PostgreSQL Flexible Server
// ============================================================
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: postgresAdminUser
    administratorLoginPassword: postgresAdminPassword
    version: '16'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-06-01-preview' = {
  parent: postgresServer
  name: postgresDbName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

// Allow Azure services to connect (Container Apps)
resource postgresFirewallAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// ============================================================
// Azure Container Apps Environment
// ============================================================
resource containerAppsEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logWorkspace.properties.customerId
        sharedKey: logWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

// ============================================================
// Azure Container Apps — FastAPI Backend
// ============================================================
var postgresConnectionString = 'postgresql+asyncpg://${postgresAdminUser}:${postgresAdminPassword}@${postgresServer.properties.fullyQualifiedDomainName}:5432/${postgresDbName}?ssl=require'
var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
var serviceBusConnectionString = listKeys('${serviceBusNamespace.id}/AuthorizationRules/RootManageSharedAccessKey', serviceBusNamespace.apiVersion).primaryConnectionString

resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 8000
        transport: 'http'
        corsPolicy: {
          allowedOrigins: [corsOrigins]
          allowedMethods: ['*']
          allowedHeaders: ['*']
          allowCredentials: true
        }
      }
      registries: [
        {
          server: acr.properties.loginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: acr.listCredentials().passwords[0].value
        }
        {
          name: 'database-url'
          value: postgresConnectionString
        }
        {
          name: 'storage-connection-string'
          value: storageConnectionString
        }
        {
          name: 'servicebus-connection-string'
          value: serviceBusConnectionString
        }
        {
          name: 'appinsights-connection-string'
          value: appInsights.properties.ConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'prodsync-backend'
          // NOTE: Using a public placeholder image for initial provisioning.
          // The real image (from ACR) is deployed immediately after via az containerapp update.
          image: empty(imageTag) || imageTag == 'placeholder' ? 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest' : '${acr.properties.loginServer}/prodsync-backend:${imageTag}'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            { name: 'APP_NAME', value: 'ProdSync' }
            { name: 'APP_ENV', value: environment }
            { name: 'PORT', value: '8000' }
            { name: 'DEBUG', value: environment == 'dev' ? 'true' : 'false' }
            { name: 'FIREBASE_PROJECT_ID', value: firebaseProjectId }
            { name: 'DATABASE_URL', secretRef: 'database-url' }
            { name: 'AZURE_STORAGE_ACCOUNT_NAME', value: storageAccount.name }
            { name: 'AZURE_STORAGE_CONTAINER_RAW', value: 'prod-sync-raw' }
            { name: 'AZURE_STORAGE_CONTAINER_PROCESSED', value: 'prod-sync-processed' }
            { name: 'AZURE_STORAGE_CONTAINER_EXPORTS', value: 'prod-sync-exports' }
            { name: 'AZURE_STORAGE_CONNECTION_STRING', secretRef: 'storage-connection-string' }
            { name: 'AZURE_SERVICE_BUS_NAMESPACE', value: '${serviceBusNamespace.name}.servicebus.windows.net' }
            { name: 'AZURE_SERVICE_BUS_CONNECTION_STRING', secretRef: 'servicebus-connection-string' }
            { name: 'AZURE_SERVICE_BUS_QUEUE_PROCESSING', value: 'document-processing' }
            { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', secretRef: 'appinsights-connection-string' }
            { name: 'CORS_ORIGINS', value: corsOrigins }
          ]
          probes: [
            {
              type: 'Liveness'
              httpGet: {
                path: '/health'
                port: 8000
              }
              periodSeconds: 30
              failureThreshold: 3
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/health'
                port: 8000
              }
              initialDelaySeconds: 10
              periodSeconds: 15
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '50'
              }
            }
          }
        ]
      }
    }
  }
}

// ============================================================
// Azure Static Web Apps — Deployed separately via GitHub Actions
// ============================================================
// Azure Static Web Apps requires its metadata region to be one of:
// centralus, eastus2, westus2, westeurope, eastasia — all blocked by
// the Azure for Students subscription region restriction policy.
//
// SOLUTION: The GitHub Actions workflow (deploy-frontend.yml) uses
// the Azure/static-web-apps-deploy action which auto-provisions the
// Static Web App resource in an allowed metadata region while still
// delivering content globally via CDN.
//
// No Bicep resource needed here — GitHub Actions handles it.

// ============================================================
// Key Vault access policy for Container App managed identity
// ============================================================
resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, backendApp.id, 'Key Vault Secrets User')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6') // Key Vault Secrets User
    principalId: backendApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// ============================================================
// Outputs — used by CI/CD workflows and setup scripts
// ============================================================
output acrLoginServer string = acr.properties.loginServer
output acrName string = acr.name
output backendUrl string = 'https://${backendApp.properties.configuration.ingress.fqdn}'
output keyVaultName string = keyVault.name
output postgresHost string = postgresServer.properties.fullyQualifiedDomainName
output containerAppsEnvName string = containerAppsEnv.name
output backendAppName string = backendApp.name
output resourceGroupName string = resourceGroup().name
output appInsightsConnectionString string = appInsights.properties.ConnectionString
output storageName string = storageAccount.name
output serviceBusNamespace string = serviceBusNamespace.name
