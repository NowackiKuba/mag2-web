import { api } from '@/lib/api/api';
import { AllegroThreadMessage } from '@/lib/types/allegro';

export const getAutorespondedThreads = async (): Promise<AllegroThreadMessage[]> => {
  const res = await api.get(`/marketplaces/allegro/threads/autoresponded`);

  return res.data;
};
