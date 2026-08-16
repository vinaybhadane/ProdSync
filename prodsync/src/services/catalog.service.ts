import type { Catalog, PaginatedResponse, CatalogFilter, ActivityEvent } from '@/types';
import { mapBackendCatalog } from '@/services/api.client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const catalogService = {
  async getCatalogs(filter: CatalogFilter = {}): Promise<PaginatedResponse<Catalog>> {
    try {
      const res = await fetch(`${API_BASE_URL}/catalogs`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch catalogs');
      const data = await res.json();
      const catalogs = (data.data || []).map(mapBackendCatalog);
      return {
        data: catalogs,
        total: catalogs.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      };
    } catch {
      return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 };
    }
  },

  async getCatalog(id: string): Promise<Catalog | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/catalogs/${id}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return mapBackendCatalog(data.data);
    } catch {
      return null;
    }
  },

  async getCatalogStats(id: string): Promise<{
    qualityTrend: Array<{ date: string; score: number }>;
    recentActivity: ActivityEvent[];
  }> {
    return {
      qualityTrend: [
        { date: 'May', score: 76 },
        { date: 'Jun', score: 81 },
        { date: 'Jul', score: 85 },
        { date: 'Aug', score: 91 },
      ],
      recentActivity: [],
    };
  },
};
