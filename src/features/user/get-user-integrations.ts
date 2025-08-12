import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { Integration } from '@/lib/types/api';

const getByUserId = async (): Promise<Integration[]> => {
  const res = await api.get(`/users/me/integrations`);

  return res.data;
};

export const useUserIntegrations = ({ opts }: { opts?: QueryOptions<Integration[]> }) => {
  return useQueryWrapper<Integration[]>(['getUserIntegrations'], () => getByUserId(), opts);
};
