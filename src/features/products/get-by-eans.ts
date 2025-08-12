import { api } from '@/lib/api/api';
import { Product } from '@/lib/types/api';

export interface ScannerResult {
  foundProducts: Product[];
  notFoundEans: {
    ean: string;
    foundOn: string[];
    notFoundOn: string[];
  }[];
}

export const getProductsByEan = async (eans: string[]): Promise<ScannerResult> => {
  const res = await api.get(`/products/eans/batch?eans=${eans.join(',')}`);

  return res.data;
};
