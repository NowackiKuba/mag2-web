import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { Product } from '@/lib/types/api';

export type SyncProductsOpts = {
  id: string;
  stock: number;
  sources: string[];
};

const syncProducts = async (payload: SyncProductsOpts): Promise<Product> => {
  const res = await api.post(`/products/sync`, payload);

  return res.data;
};

export const useSyncProducts = ({ opts }: { opts: MutationOptions<Product> }) => {
  return useMutationWrapper<Product, SyncProductsOpts>((data) => syncProducts(data), opts);
};
