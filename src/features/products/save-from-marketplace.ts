import { api } from '@/lib/api/api';
import { MutationOptions, useMutationWrapper } from '@/lib/config/react-query';
import { IntegrationPlatform, Product } from '@/lib/types/api';

const saveFromMarketplace = async (platform: IntegrationPlatform): Promise<Product> => {
  const res = await api.post(`/products/save?platform=${platform}`);

  return res.data;
};

export const useSaveProductsFromMarketplace = ({ opts }: { opts: MutationOptions<Product> }) => {
  return useMutationWrapper<Product, { platform: IntegrationPlatform }>((data) => saveFromMarketplace(data.platform), opts);
};
