import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { ProductSource } from '@/lib/types/api';
import { MarketplaceProductDetails } from '@/lib/types/common';

export const getProductMarketplaceDetails = async ({ source, id }: { source: ProductSource; id: string }): Promise<MarketplaceProductDetails> => {
  const res = await api.get(`/products/${id}/marketplace/details?source=${source}`);

  return res.data;
};

export const useMarketplaceDetails = ({ opts, source, id }: { opts: QueryOptions<MarketplaceProductDetails>; source: ProductSource; id: string }) => {
  return useQueryWrapper<MarketplaceProductDetails>(
    ['get-product-marketplace-details', { source, id }],
    () => getProductMarketplaceDetails({ source, id }),
    opts
  );
};
