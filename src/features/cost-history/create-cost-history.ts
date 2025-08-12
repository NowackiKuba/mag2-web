import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { ProductCostHistory } from '@/lib/types/api';
import { z } from 'zod';

export const createCostHistorySchema = z.object({
  ean: z.string({ message: 'Required' }),
  name: z.string({ message: 'Required' }),
  quantity: z.number({ message: 'Required' }).min(0, { message: 'Quantity should be positive nubmer' }),
  unitCost: z.number({ message: 'Required' }),
  unitPrice: z.number({ message: 'Required' }),
  currency: z.string({ message: 'Required' }),
  purchasedAt: z.date({ message: 'Required' }),
});

export type CreateCostHistoryInput = z.infer<typeof createCostHistorySchema>;

const create = async (data: CreateCostHistoryInput): Promise<ProductCostHistory> => {
  const res = await api.post('/cost-history', data);

  return res.data;
};

export const useCreateCostHistory = ({ opts }: { opts: MutationOptions<ProductCostHistory> }) => {
  return useMutationWrapper<ProductCostHistory, CreateCostHistoryInput>((creds) => create(creds), opts);
};
