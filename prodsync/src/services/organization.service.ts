import { Catalog, Product, ActivityEvent, AppNotification, Analytics } from '@/types';
import { MOCK_CATALOGS, MOCK_PRODUCTS } from '@/data/mock';

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  createdAt: string;
  ownerId?: string;
  ownerEmail?: string;
}

export interface OrgMember {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Invited';
  joinedAt: string;
}

export interface OrgInvitation {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  invitedBy: string;
  createdAt: string;
}

const ORGS_KEY = 'prodsync_all_orgs';
const MEMBERS_KEY = 'prodsync_org_members';
const INVITES_KEY = 'prodsync_org_invitations';
const ACTIVE_ORG_KEY = 'prodsync_active_org_id';

// Default primary demo organization
const DEFAULT_ORG: OrganizationRecord = {
  id: 'org_unilog_enterprise',
  name: 'Unilog Industrial Hub',
  slug: 'unilog-industrial',
  domain: 'unilog.com',
  plan: 'enterprise',
  createdAt: '2026-01-15T00:00:00.000Z',
  ownerEmail: 'admin@prodsync.ai',
};

const DEFAULT_MEMBERS: OrgMember[] = [
  { id: 'm1', organizationId: 'org_unilog_enterprise', name: 'Alex Chen', email: 'alex@unilog.com', role: 'Owner', status: 'Active', joinedAt: '2026-01-15' },
  { id: 'm2', organizationId: 'org_unilog_enterprise', name: 'Sarah Jenkins', email: 'sarah.j@unilog.com', role: 'Admin', status: 'Active', joinedAt: '2026-02-01' },
  { id: 'm3', organizationId: 'org_unilog_enterprise', name: 'David Kumar', email: 'd.kumar@unilog.com', role: 'Editor', status: 'Active', joinedAt: '2026-02-10' },
];

function getStoredJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredJSON<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export const organizationService = {
  /**
   * Initializes default storage if empty
   */
  init() {
    if (typeof window === 'undefined') return;
    const orgs = getStoredJSON<OrganizationRecord[]>(ORGS_KEY, []);
    if (orgs.length === 0) {
      setStoredJSON(ORGS_KEY, [DEFAULT_ORG]);
      setStoredJSON(MEMBERS_KEY, DEFAULT_MEMBERS);
    }
  },

  /**
   * Gets all registered organizations
   */
  getAllOrganizations(): OrganizationRecord[] {
    this.init();
    return getStoredJSON<OrganizationRecord[]>(ORGS_KEY, [DEFAULT_ORG]);
  },

  /**
   * Gets organization by ID
   */
  getOrganizationById(orgId: string): OrganizationRecord | null {
    const orgs = this.getAllOrganizations();
    return orgs.find((o) => o.id === orgId) || null;
  },

  /**
   * Gets organization for a given user email
   */
  getOrganizationForUser(email: string | null): OrganizationRecord {
    this.init();
    if (!email) return DEFAULT_ORG;

    const normalizedEmail = email.toLowerCase().trim();
    const members = getStoredJSON<OrgMember[]>(MEMBERS_KEY, DEFAULT_MEMBERS);

    // 1. Check if user is a direct member of any organization
    const member = members.find((m) => m.email.toLowerCase() === normalizedEmail);
    if (member) {
      const org = this.getOrganizationById(member.organizationId);
      if (org) return org;
    }

    // 2. Check if user has a pending invitation
    const invites = getStoredJSON<OrgInvitation[]>(INVITES_KEY, []);
    const pendingInvite = invites.find((inv) => inv.email.toLowerCase() === normalizedEmail);
    if (pendingInvite) {
      const org = this.getOrganizationById(pendingInvite.organizationId);
      if (org) {
        // Auto-join invited organization
        this.addMember(org.id, normalizedEmail.split('@')[0], normalizedEmail, pendingInvite.role);
        // Remove accepted invite
        setStoredJSON(
          INVITES_KEY,
          invites.filter((i) => i.id !== pendingInvite.id)
        );
        return org;
      }
    }

    // 3. Fallback to active organization or default
    const activeId = localStorage.getItem(ACTIVE_ORG_KEY);
    if (activeId) {
      const org = this.getOrganizationById(activeId);
      if (org) return org;
    }

    return DEFAULT_ORG;
  },

  /**
   * Creates a brand new isolated Organization for a registering user
   */
  createOrganization(
    companyName: string,
    ownerEmail: string,
    ownerName: string
  ): OrganizationRecord {
    this.init();
    const cleanName = companyName.trim() || `${ownerName}'s Organization`;
    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const orgId = `org_${slug}_${Math.random().toString(36).substring(2, 7)}`;

    const newOrg: OrganizationRecord = {
      id: orgId,
      name: cleanName,
      slug,
      domain: ownerEmail.includes('@') ? ownerEmail.split('@')[1] : undefined,
      plan: 'enterprise',
      createdAt: new Date().toISOString(),
      ownerEmail,
    };

    // Save Organization
    const orgs = this.getAllOrganizations();
    setStoredJSON(ORGS_KEY, [...orgs, newOrg]);

    // Add Owner as primary member
    const newMember: OrgMember = {
      id: `m_${Date.now()}`,
      organizationId: orgId,
      name: ownerName || ownerEmail.split('@')[0],
      email: ownerEmail.toLowerCase().trim(),
      role: 'Owner',
      status: 'Active',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    const members = getStoredJSON<OrgMember[]>(MEMBERS_KEY, DEFAULT_MEMBERS);
    setStoredJSON(MEMBERS_KEY, [...members, newMember]);

    // Seed clean initial workspace data for the new organization
    this.seedNewWorkspace(orgId, cleanName, ownerName);

    // Set as active organization
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_ORG_KEY, orgId);
    }

    return newOrg;
  },

  /**
   * Seeds clean starting data for a newly created organization
   */
  seedNewWorkspace(orgId: string, orgName: string, ownerName: string) {
    const timestamp = new Date().toISOString();

    // 1. Starter Catalog scoped to this organization
    const starterCatalog: Catalog = {
      id: `cat_${orgId}_master`,
      name: `${orgName} Master Catalog`,
      description: `Primary technical product repository for ${orgName}`,
      productCount: 4,
      dataQualityScore: 92,
      validationRate: 95,
      enrichmentRate: 88,
      completenessRate: 91,
      processingStatus: 'completed',
      categories: ['Industrial Automation', 'Sensors & Instrumentation', 'Power Distribution'],
      manufacturers: [orgName, 'Siemens', 'Schneider Electric', 'Rockwell'],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // 2. Starter Products scoped to this organization
    const starterProducts: Product[] = MOCK_PRODUCTS.slice(0, 4).map((p, idx) => ({
      ...p,
      id: `prod_${orgId}_${idx + 1}`,
      catalogId: starterCatalog.id,
      manufacturer: idx === 0 ? orgName : p.manufacturer,
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    // 3. Welcome Activity Event
    const initialActivity: ActivityEvent = {
      id: `act_${Date.now()}`,
      type: 'catalog_created',
      title: 'Workspace Initialized',
      description: `${ownerName} created the ${orgName} organization workspace on ProdSync.`,
      entityType: 'catalog',
      entityName: starterCatalog.name,
      userName: ownerName,
      createdAt: timestamp,
    };

    // 4. Welcome Notification
    const welcomeNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type: 'success',
      title: `Welcome to ${orgName} Workspace`,
      description: 'Your isolated multi-tenant organization is active. Invite colleagues or import datasheets to begin.',
      read: false,
      createdAt: timestamp,
    };

    // Store in isolated organization buckets
    setStoredJSON(`prodsync_catalogs_${orgId}`, [starterCatalog]);
    setStoredJSON(`prodsync_products_${orgId}`, starterProducts);
    setStoredJSON(`prodsync_activity_${orgId}`, [initialActivity]);
    setStoredJSON(`prodsync_notifications_${orgId}`, [welcomeNotif]);
  },

  /**
   * Gets members belonging exclusively to an organization
   */
  getMembers(orgId: string): OrgMember[] {
    this.init();
    const members = getStoredJSON<OrgMember[]>(MEMBERS_KEY, DEFAULT_MEMBERS);
    return members.filter((m) => m.organizationId === orgId);
  },

  /**
   * Adds a member to an organization
   */
  addMember(orgId: string, name: string, email: string, role: OrgMember['role']): OrgMember {
    const members = getStoredJSON<OrgMember[]>(MEMBERS_KEY, DEFAULT_MEMBERS);
    const existing = members.find(
      (m) => m.organizationId === orgId && m.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (existing) return existing;

    const newMember: OrgMember = {
      id: `m_${Date.now()}`,
      organizationId: orgId,
      name: name.trim() || email.split('@')[0],
      email: email.toLowerCase().trim(),
      role,
      status: 'Active',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setStoredJSON(MEMBERS_KEY, [...members, newMember]);
    return newMember;
  },

  /**
   * Invites a member to an organization
   */
  inviteMember(
    orgId: string,
    email: string,
    role: OrgInvitation['role'],
    invitedBy: string
  ): OrgInvitation {
    const org = this.getOrganizationById(orgId) || DEFAULT_ORG;
    const cleanEmail = email.toLowerCase().trim();

    const newInvite: OrgInvitation = {
      id: `inv_${Date.now()}`,
      organizationId: orgId,
      organizationName: org.name,
      email: cleanEmail,
      role,
      invitedBy,
      createdAt: new Date().toISOString(),
    };

    const invites = getStoredJSON<OrgInvitation[]>(INVITES_KEY, []);
    setStoredJSON(INVITES_KEY, [...invites, newInvite]);

    // Also add to members table with status 'Invited'
    const members = getStoredJSON<OrgMember[]>(MEMBERS_KEY, DEFAULT_MEMBERS);
    const existingMember = members.find(
      (m) => m.organizationId === orgId && m.email.toLowerCase() === cleanEmail
    );
    if (!existingMember) {
      members.push({
        id: `m_${Date.now()}`,
        organizationId: orgId,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: role as any,
        status: 'Invited',
        joinedAt: new Date().toISOString().split('T')[0],
      });
      setStoredJSON(MEMBERS_KEY, members);
    }

    return newInvite;
  },

  // ─────────────────────────────────────────────────────────────
  // SCOPED DATA ACCESSORS (ISOLATION LAYER)
  // ─────────────────────────────────────────────────────────────

  /**
   * Gets catalogs belonging strictly to the specified organization
   */
  getCatalogs(orgId: string): Catalog[] {
    this.init();
    if (orgId === DEFAULT_ORG.id) {
      return getStoredJSON<Catalog[]>(`prodsync_catalogs_${orgId}`, MOCK_CATALOGS);
    }
    return getStoredJSON<Catalog[]>(`prodsync_catalogs_${orgId}`, []);
  },

  /**
   * Saves catalogs for the specified organization
   */
  saveCatalogs(orgId: string, catalogs: Catalog[]) {
    setStoredJSON(`prodsync_catalogs_${orgId}`, catalogs);
  },

  /**
   * Gets products belonging strictly to the specified organization
   */
  getProducts(orgId: string): Product[] {
    this.init();
    if (orgId === DEFAULT_ORG.id) {
      return getStoredJSON<Product[]>(`prodsync_products_${orgId}`, MOCK_PRODUCTS);
    }
    return getStoredJSON<Product[]>(`prodsync_products_${orgId}`, []);
  },

  /**
   * Saves products for the specified organization
   */
  saveProducts(orgId: string, products: Product[]) {
    setStoredJSON(`prodsync_products_${orgId}`, products);
  },

  /**
   * Gets notifications strictly for the specified organization
   */
  getNotifications(orgId: string): AppNotification[] {
    this.init();
    return getStoredJSON<AppNotification[]>(`prodsync_notifications_${orgId}`, [
      {
        id: `notif_${orgId}_1`,
        type: 'info',
        title: 'Organization Workspace Active',
        description: 'Multi-tenant isolation enabled. Data is private to your organization.',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  },

  /**
   * Gets activity events strictly for the specified organization
   */
  getActivity(orgId: string): ActivityEvent[] {
    this.init();
    return getStoredJSON<ActivityEvent[]>(`prodsync_activity_${orgId}`, []);
  },

  /**
   * Adds an activity event to the organization log
   */
  addActivity(orgId: string, event: ActivityEvent) {
    const current = this.getActivity(orgId);
    setStoredJSON(`prodsync_activity_${orgId}`, [event, ...current]);
  },

  /**
   * Deletes a single product from the organization and updates catalog counts
   */
  deleteProduct(orgId: string, productId: string) {
    const products = this.getProducts(orgId);
    const updated = products.filter((p) => p.id !== productId);
    this.saveProducts(orgId, updated);

    // Update catalog product count
    const catalogs = this.getCatalogs(orgId);
    const updatedCatalogs = catalogs.map((cat) => ({
      ...cat,
      productCount: updated.filter((p) => p.catalogId === cat.id).length,
    }));
    this.saveCatalogs(orgId, updatedCatalogs);

    // Record activity event
    this.addActivity(orgId, {
      id: `act_${Date.now()}`,
      type: 'product_created',
      title: 'Product Deleted',
      description: `Product ID #${productId.slice(0, 8)} removed from workspace.`,
      userName: 'User',
      createdAt: new Date().toISOString(),
    });
  },

  /**
   * Deletes multiple products from the organization
   */
  bulkDeleteProducts(orgId: string, productIds: string[], deleteAll: boolean = false) {
    if (deleteAll) {
      this.saveProducts(orgId, []);
      const catalogs = this.getCatalogs(orgId);
      this.saveCatalogs(orgId, catalogs.map((c) => ({ ...c, productCount: 0 })));
    } else {
      const idSet = new Set(productIds);
      const products = this.getProducts(orgId);
      const updated = products.filter((p) => !idSet.has(p.id));
      this.saveProducts(orgId, updated);

      const catalogs = this.getCatalogs(orgId);
      const updatedCatalogs = catalogs.map((cat) => ({
        ...cat,
        productCount: updated.filter((p) => p.catalogId === cat.id).length,
      }));
      this.saveCatalogs(orgId, updatedCatalogs);
    }
  },

  /**
   * Deletes a catalog and its associated products
   */
  deleteCatalog(orgId: string, catalogId: string) {
    const catalogs = this.getCatalogs(orgId);
    this.saveCatalogs(orgId, catalogs.filter((c) => c.id !== catalogId));

    // Remove products linked to this catalog
    const products = this.getProducts(orgId);
    this.saveProducts(orgId, products.filter((p) => p.catalogId !== catalogId));

    // Record activity
    this.addActivity(orgId, {
      id: `act_${Date.now()}`,
      type: 'catalog_created',
      title: 'Catalog Removed',
      description: `Catalog #${catalogId.slice(0, 8)} and associated products were removed.`,
      userName: 'User',
      createdAt: new Date().toISOString(),
    });
  },

  /**
   * Calculates live, real-time analytics from remaining products and catalogs
   */
  calculateAnalytics(orgId: string): Analytics {
    const products = this.getProducts(orgId);
    const catalogs = this.getCatalogs(orgId);

    if (products.length === 0) {
      return {
        totalProducts: 0,
        aiProcessed: 0,
        validated: 0,
        needsReview: 0,
        enrichmentOpportunities: 0,
        dataQualityScore: 0,
        processingVolume: [],
        qualityTrend: [],
        validationDistribution: [
          { name: 'Validated', value: 0, color: '#10b981' },
          { name: 'Needs Review', value: 0, color: '#f59e0b' },
          { name: 'Pending AI', value: 0, color: '#3b82f6' },
        ],
        completenessDistribution: [],
        enrichmentRate: [],
        categoryDistribution: [],
      };
    }

    const total = products.length;
    const validated = products.filter(
      (p) => p.validationStatus === 'verified' || p.validationStatus === 'ai_validated'
    ).length;
    const needsReview = products.filter(
      (p) => p.validationStatus === 'needs_review' || p.validationStatus === 'invalid'
    ).length;
    const aiProcessed = products.filter(
      (p) => (p.aiConfidence || 0) > 0 || (p.completeness || 0) > 0
    ).length;
    const enrichCount = products.reduce(
      (sum, p) => sum + (p.enrichmentSuggestions?.length || 0),
      0
    );
    const avgScore = Math.round(
      products.reduce((sum, p) => sum + (p.dataQualityScore || 90), 0) / total
    );

    // Distribution
    const valDist = [
      { name: 'Verified / Validated', value: validated, color: '#10b981' },
      { name: 'Needs Review', value: needsReview, color: '#f59e0b' },
      { name: 'AI Processed', value: Math.max(0, aiProcessed - validated), color: '#3b82f6' },
    ];

    // Weekly quality trend
    const qualityTrend = [
      { date: '2026-07-20', value: Math.max(50, avgScore - 8) },
      { date: '2026-07-27', value: Math.max(50, avgScore - 5) },
      { date: '2026-08-03', value: Math.max(50, avgScore - 2) },
      { date: '2026-08-10', value: avgScore },
      { date: '2026-08-16', value: avgScore },
    ];

    // Weekly processing volume
    const processingVolume = [
      { date: 'Week 1', value: Math.round(total * 0.2) },
      { date: 'Week 2', value: Math.round(total * 0.3) },
      { date: 'Week 3', value: Math.round(total * 0.6) },
      { date: 'Week 4', value: total },
    ];

    return {
      totalProducts: total,
      aiProcessed,
      validated,
      needsReview,
      enrichmentOpportunities: enrichCount,
      dataQualityScore: avgScore,
      processingVolume,
      qualityTrend,
      validationDistribution: valDist,
      completenessDistribution: [],
      enrichmentRate: [],
      categoryDistribution: [],
    };
  },

  /**
   * Resets all data in the organization workspace back to zero
   */
  clearAllOrganizationData(orgId: string) {
    setStoredJSON(`prodsync_catalogs_${orgId}`, []);
    setStoredJSON(`prodsync_products_${orgId}`, []);
    setStoredJSON(`prodsync_activity_${orgId}`, [
      {
        id: `act_${Date.now()}`,
        type: 'import_completed',
        title: 'Workspace Reset',
        description: 'All files, catalogs, and products have been cleared.',
        userName: 'User',
        createdAt: new Date().toISOString(),
      },
    ]);
  },
};
