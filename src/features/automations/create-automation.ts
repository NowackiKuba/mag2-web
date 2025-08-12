import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { Automation } from '@/lib/types/api';
import { z } from 'zod';

export const createAutomationSchema = z.object({
  action: z.string({ message: 'Required' }),
  integrationId: z.string({ message: 'Required' }),
  metadata: z
    .object({
      message: z.string().optional(),
    })
    .optional(),
});

export type CreateAutomationInput = z.input<typeof createAutomationSchema>;

const create = async (payload: CreateAutomationInput) => {
  const res = await api.post('/automations', payload);

  return res.data;
};

export const useCreateAutomation = ({ opts }: { opts: MutationOptions<Automation> }) => {
  return useMutationWrapper<Automation, CreateAutomationInput>((creds) => create(creds), opts);
};
