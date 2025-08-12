import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { Automation } from '@/lib/types/api';

const getUserAutomations = async (): Promise<Automation[]> => {
  const res = await api.get('/users/me/automations');

  return res.data;
};

export const useUserAutomations = ({ opts }: { opts?: QueryOptions<Automation[]> }) => {
  return useQueryWrapper<Automation[]>(['getUserAutomations'], () => getUserAutomations(), opts);
};
