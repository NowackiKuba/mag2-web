import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { CheckoutForm } from '@/lib/types/allegro';

const getOrderById = async (id: string): Promise<CheckoutForm> => {
  const res = await api.get(`/marketplaces/allegro/orders/${id}`);

  return res.data;
};

export const useOrder = ({ id, opts }: { opts?: QueryOptions<CheckoutForm>; id: string }) => {
  return useQueryWrapper<CheckoutForm>(['getOrder', { id }], () => getOrderById(id), opts);
};
