import { api } from '@/lib/api/api';
import { Order } from '@/lib/types/api';

export const getOrderAnalytics = async (): Promise<Order[]> => {
  const res = await api.get(`/analytics/orders`);

  return res.data;
};
