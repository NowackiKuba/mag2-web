import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { Integration } from '@/lib/types/api';
import { z } from 'zod';

export const createInterationSchema = z.object({
  expiresAt: z.date(),
  name: z.string(),
  platform: z.string(),
  slug: z.string(),
  apiKey: z.string().optional(),
  code: z.string().optional(),
});

export type CreateIntegrationInput = z.infer<typeof createInterationSchema>;

const createIntegration = async (data: CreateIntegrationInput): Promise<Integration> => {
  let url = `/integrations`;
  if (data.code) {
    url += `?code=${data.code}`;
  }
  const res = await api.post(url, {
    expiresAt: data.expiresAt,
    name: data.name,
    platform: data.platform,
    slug: data.slug,
    apiKey: data.apiKey,
  });

  return res.data;
};

export const useCreateIntegration = ({ opts }: { opts: MutationOptions<Integration> }) => {
  return useMutationWrapper<Integration, CreateIntegrationInput>((creds) => createIntegration(creds), opts);
};
