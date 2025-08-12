import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { Product, ProductSource } from '@/lib/types/api';

type GetUserProductsQueryOptions = {
  page: number;
  pageSize: number;
  search?: string;
  source?: ProductSource;
};

type GetUserProductsResponse = { products: Product[]; count: number; totalCount: number };

const getUserProducts = async ({ page, pageSize, search, source }: GetUserProductsQueryOptions): Promise<GetUserProductsResponse> => {
  const res = await api.get(`/users/me/products?page=${page}&pageSize=${pageSize}&search=${search}&source=${source}`);

  return res.data;
};

export const useUserProducts = ({ opts, ...queryOptions }: { opts?: QueryOptions<GetUserProductsResponse>; queryOptions: GetUserProductsQueryOptions }) => {
  return useQueryWrapper<GetUserProductsResponse>(['getUserProducts', { ...queryOptions }], () => getUserProducts({ ...queryOptions.queryOptions }), opts);
};
