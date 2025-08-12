import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { AllegroOffer } from '@/lib/types/allegro';

const getOfferById = async (id: string): Promise<AllegroOffer> => {
  const res = await api.get(`/marketplaces/allegro/offers/${id}`);

  return res.data?.offers[0];
};

export const useOffer = ({ id, opts }: { opts?: QueryOptions<AllegroOffer>; id: string }) => {
  return useQueryWrapper<AllegroOffer>(['getOffer', { id }], () => getOfferById(id), opts);
};
