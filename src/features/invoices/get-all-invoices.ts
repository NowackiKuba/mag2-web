import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { FakturowoInvoice, IntegrationPlatform } from '@/lib/types/api';

type InvoiceResponse = {
  invoices: FakturowoInvoice[];
  success: string;
  totalPages: number;
};

const getAllFakturowoInvoices = async (): Promise<InvoiceResponse> => {
  const res = await api.get(`/invoices/fakturowo`);

  return res.data;
};

const getFunctionByProvider = (provider: IntegrationPlatform) => {
  switch (provider) {
    case IntegrationPlatform.FAKTUROWO:
      return getAllFakturowoInvoices;
    default:
      return getAllFakturowoInvoices;
  }
};

export const useInvoices = ({ opts, provider }: { opts: QueryOptions<InvoiceResponse>; provider: IntegrationPlatform }) => {
  const func = getFunctionByProvider(provider);

  return useQueryWrapper<InvoiceResponse>(['getInvoices'], () => func(), opts);
};
