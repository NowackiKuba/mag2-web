import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { Automation } from '@/lib/types/api';
import { z } from 'zod';

export const updateAutomationSchema = z.object({
  isActive: z.boolean(),
  id: z.string(),
});

export type UpdateAutomationInput = z.infer<typeof updateAutomationSchema>;

const updateAutomation = async (data: UpdateAutomationInput): Promise<Automation> => {
  const res = await api.patch(`/automations/${data.id}`, { isActive: data.isActive });

  return res.data;
};

export const useUpdateAutomation = ({ opts }: { opts: MutationOptions<Automation> }) => {
  return useMutationWrapper<Automation, UpdateAutomationInput>((creds) => updateAutomation(creds), opts);
};
