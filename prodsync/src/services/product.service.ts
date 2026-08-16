import type { Product, PaginatedResponse, ProductFilter } from '@/types';
import { liveProductService } from '@/services/api.client';

export const productService = liveProductService;
