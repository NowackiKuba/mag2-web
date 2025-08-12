import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { User } from '@/lib/types/api';
import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

export type UpdateUserInput = z.input<typeof updateUserSchema>;

export const updateUser = async (data: UpdateUserInput): Promise<User> => {
  const res = await api.patch(`/users/me/update`, data);

  return res.data;
};

export const useUpdateUser = ({ opts }: { opts: MutationOptions<User> }) => {
  return useMutationWrapper<User, UpdateUserInput>((creds) => updateUser(creds), opts, 'Successfully updated user');
};
