import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { IntegrationPlatform, Order } from '@/lib/types/api';

type OrdersResponse = { orders: Order[]; total: number; page: number; pageSize: number; totalPages: number };

const getUserOrders = async ({ page, pageSize, search, status, source }: GetUserOrdersQueries): Promise<OrdersResponse> => {
  const res = await api.get(`/orders?page=${page}&pageSize=${pageSize}&search=${search}&status=${status}&source=${source}`);

  return res.data;
};

export type GetUserOrdersQueries = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  source?: IntegrationPlatform;
};

export const useUserOrders = ({ opts, ...queryProps }: { opts?: QueryOptions<OrdersResponse>; queryProps: GetUserOrdersQueries }) => {
  return useQueryWrapper<OrdersResponse>(['get-me', { ...queryProps }], () => getUserOrders({ ...queryProps.queryProps }), opts);
};
