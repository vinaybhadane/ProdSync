// ============================================================
// ProdSync — Core TypeScript Types
// ============================================================

export type ValidationStatus =
  | 'verified'
  | 'ai_validated'
  | 'ai_suggested'
  | 'needs_review'
  | 'invalid'
  | 'missing'
  | 'new_value'
  | 'conflict'
  | 'low_confidence'
  | 'unverified';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'ready_for_review';
export type IssueSeverity = 'critical' | 'warning' | 'info';
export type SourceType = 'pdf' | 'csv' | 'xlsx' | 'url' | 'manual' | 'datasheet' | 'catalog' | 'image' | 'manufacturer' | 'distributor' | 'technical_datasheet';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
}

export type UserRole =
  | 'product_manager'
  | 'catalog_manager'
  | 'procurement'
  | 'sales'
  | 'engineering'
  | 'administrator'
  | 'other';

export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  productCount: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  manufacturer: string;
  category: string;
  description?: string;
  imageUrl?: string;
  catalogId?: string;
  status: ProductStatus;
  completeness: number;
  aiConfidence: number;
  dataQualityScore: number;
  validationStatus: ValidationStatus;
  
  // Unilog Content Tiers
  brand?: string;
  series?: string;
  classpath?: string;
  unspsc?: string;
  invoiceDesc?: string;
  mobileDesc?: string;
  productTitle?: string;
  longDescription?: string;
  bulletFeatures?: string[];

  attributes: ProductAttribute[];
  sources: ProductSource[];
  aiInsights: AIInsight[];
  validationIssues: ValidationIssue[];
  enrichmentSuggestions: EnrichmentSuggestion[];
  processingJobId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus =
  | 'draft'
  | 'processing'
  | 'needs_review'
  | 'validated'
  | 'approved'
  | 'exported';

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  normalizedValue?: string;
  unit?: string;
  status: ValidationStatus;
  confidence: number;
  source?: string;
  sourceType?: SourceType;
  sourceUrl?: string;
  aiReason?: string;
  evidenceSnippet?: string;
  isAiGenerated?: boolean;
  isEnriched?: boolean;
  lastUpdated: string;
}

export interface Catalog {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  dataQualityScore: number;
  validationRate: number;
  enrichmentRate: number;
  completenessRate: number;
  processingStatus: ProcessingStatus;
  categories: string[];
  manufacturers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogDetail extends Catalog {
  missingFieldCount: number;
  invalidFieldCount: number;
  conflictingFieldCount: number;
  aiGeneratedFieldCount: number;
  recentActivity: ActivityEvent[];
  products: Product[];
}

export interface ValidationResult {
  productId: string;
  overallStatus: ValidationStatus;
  score: number;
  issues: ValidationIssue[];
  verifiedCount: number;
  warningCount: number;
  criticalCount: number;
  runAt: string;
}

export interface ValidationIssue {
  id: string;
  productId: string;
  productName?: string;
  productSku?: string;
  attributeName: string;
  severity: IssueSeverity;
  title: string;
  description: string;
  sourceAValue?: string;
  sourceBValue?: string;
  sourceALabel?: string;
  sourceBLabel?: string;
  sourceA?: { value: string; sourceName: string; type: string };
  sourceB?: { value: string; sourceName: string; type: string };
  recommendedAction?: string;
  status: 'open' | 'accepted' | 'rejected' | 'resolved';
  createdAt: string;
}

export interface EnrichmentSuggestion {
  id: string;
  productId: string;
  productName?: string;
  attributeName: string;
  currentValue?: string;
  suggestedValue: string;
  confidence: number;
  reason: string;
  source?: string;
  sourceType?: SourceType;
  status: 'pending' | 'accepted' | 'rejected' | 'edited';
  editedValue?: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  productId?: string;
  type: 'enrichment' | 'validation' | 'extraction' | 'suggestion';
  title: string;
  description: string;
  confidence: number;
  attributeNames: string[];
  source?: string;
  sourceType?: SourceType;
  createdAt: string;
}

export interface ProductSource {
  id: string;
  productId?: string;
  name: string;
  type: SourceType;
  url?: string;
  filename?: string;
  extractedAt?: string;
  uploadedAt?: string;
  pageNumber?: number;
  section?: string;
  attributeCount: number;
  confidence: number;
}

export interface ProcessingJob {
  id: string;
  catalogId?: string;
  productId?: string;
  filename: string;
  sourceType: SourceType;
  status: ProcessingStatus;
  stages: ProcessingStage[];
  progress: number;
  currentStage: string;
  productCount: number;
  totalProducts: number;
  processedProducts: number;
  failedProducts: number;
  attributesExtracted: number;
  validationIssues: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  errorMessage?: string;
}

export interface ProcessingStage {
  name: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  details?: string;
}

export interface Analytics {
  totalProducts: number;
  aiProcessed: number;
  validated: number;
  needsReview: number;
  enrichmentOpportunities: number;
  dataQualityScore: number;
  processingVolume: TimeSeriesData[];
  qualityTrend: TimeSeriesData[];
  validationDistribution: DistributionData[];
  completenessDistribution: DistributionData[];
  enrichmentRate: TimeSeriesData[];
  categoryDistribution: DistributionData[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface DistributionData {
  name: string;
  value: number;
  color?: string;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  message?: string;
  read: boolean;
  link?: string;
  actionLabel?: string;
  actionHref?: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type: ActivityType | string;
  title: string;
  description: string;
  entityId?: string;
  entityName?: string;
  entityType?: 'product' | 'catalog' | 'import' | 'validation' | 'enrichment';
  userId?: string;
  userName?: string;
  userAvatar?: string;
  timestamp?: string;
  createdAt?: string;
  metadata?: Record<string, any>;
}

export type ActivityType =
  | 'product_created'
  | 'product_validated'
  | 'product_enriched'
  | 'product_approved'
  | 'catalog_created'
  | 'import_completed'
  | 'import_failed'
  | 'validation_completed'
  | 'enrichment_completed'
  | 'issue_resolved'
  | 'user_login';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ImportJob {
  id: string;
  filename: string;
  fileType: SourceType;
  fileSize: number;
  status: ProcessingStatus;
  progress: number;
  stages: ImportStage[];
  productCount?: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ImportStage {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface ProductFilter {
  search?: string;
  category?: string;
  manufacturer?: string;
  status?: ProductStatus;
  validationStatus?: ValidationStatus;
  completenessMin?: number;
  catalogId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CatalogFilter {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
