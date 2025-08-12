import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { User } from '@/lib/types/api';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string({ message: 'Required' }),
  password: z.string({ message: 'Required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

const login = async (data: LoginInput): Promise<User> => {
  const res = await api.post('/auth/login', data);

  return res.data;
};

export const useLogin = ({ opts }: { opts: MutationOptions<User> }) => {
  return useMutationWrapper<User, LoginInput>((creds) => login(creds), opts);
};
