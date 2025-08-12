import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { Product } from '@/lib/types/api';

const getById = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/${id}?extend=${true}`);

  return res.data;
};

export const useProduct = ({ opts, id }: { opts?: QueryOptions<Product>; id: string }) => {
  return useQueryWrapper<Product>(['getProductById', { id }], () => getById(id), opts);
};
