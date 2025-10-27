import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { Product } from '@/lib/types/api';

export type SyncProductsOpts = {
  id: string;
  stock: number;
  sources: string[];
};

const updateProducts = async (payload: SyncProductsOpts): Promise<Product> => {
  const res = await api.post(`/products/update`, payload);

  return res.data;
};

export const useUpdateProducts = ({ opts }: { opts: MutationOptions<Product> }) => {
  return useMutationWrapper<Product, SyncProductsOpts>((data) => updateProducts(data), opts);
};
