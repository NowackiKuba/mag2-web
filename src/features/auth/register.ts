import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { User } from '@/lib/types/api';
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string({ message: 'Required' }),
  email: z.string({ message: 'Required' }),
  password: z.string({ message: 'Required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

const register = async (data: RegisterInput): Promise<User> => {
  const res = await api.post('/auth/register', data);

  return res.data;
};

export const useRegister = ({ opts }: { opts: MutationOptions<User> }) => {
  return useMutationWrapper<User, RegisterInput>((creds) => register(creds), opts);
};
