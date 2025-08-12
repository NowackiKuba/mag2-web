import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { AllegroOffersResponse } from '@/lib/types/allegro';

const getUserOffers = async ({ page, pageSize, search }: GetUserOffersQueries): Promise<AllegroOffersResponse> => {
  const res = await api.get(`/users/me/offers?page=${page}&pageSize=${pageSize}&search=${search}`);

  return res.data;
};

export type GetUserOffersQueries = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export const useUserOffers = ({ opts, ...queryProps }: { opts?: QueryOptions<AllegroOffersResponse>; queryProps: GetUserOffersQueries }) => {
  return useQueryWrapper<AllegroOffersResponse>(['getOffers', { ...queryProps }], () => getUserOffers({ ...queryProps.queryProps }), opts);
};
