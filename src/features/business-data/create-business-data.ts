import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { UserBusinessData } from '@/lib/types/api';
import { z } from 'zod';

export const createBusinessDataSchema = z.object({
  companyName: z.string({ message: 'Required' }),
  city: z.string({ message: 'Required' }),
  state: z.string(),
  postalCode: z.string({ message: 'Required' }),
  country: z.string({ message: 'Required' }),
  houseNumber: z.string({ message: 'Required' }),
  street: z.string({ message: 'Required' }),
  nipNumber: z.string({ message: 'Required' }),
});

export type CreateBusinessDataInput = z.infer<typeof createBusinessDataSchema>;

const create = async (data: CreateBusinessDataInput): Promise<UserBusinessData> => {
  const res = await api.post('/users/business-info', data);

  return res.data;
};

export const useCreateBusinessData = ({ opts }: { opts: MutationOptions<UserBusinessData> }) => {
  return useMutationWrapper<UserBusinessData, CreateBusinessDataInput>((creds) => create(creds), opts);
};
