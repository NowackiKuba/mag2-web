import { api } from '@/lib/api/api';
import { IntegrationPlatform } from '@/lib/types/api';

export const syncProducts = async (source: IntegrationPlatform) => {
  const res = await api.post(`/products/save?platform=${source}`);

  return res.data;
};
