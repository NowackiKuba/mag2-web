import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { User } from '@/lib/types/api';

const getMe = async (): Promise<User> => {
  const res = await api.get('/users/me');

  return res.data;
};

export const useMe = ({ opts }: { opts?: QueryOptions<User> }) => {
  return useQueryWrapper<User>(['get-me'], () => getMe(), opts);
};
