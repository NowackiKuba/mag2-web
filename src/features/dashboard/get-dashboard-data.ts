import { api } from '@/lib/api/api';
import { QueryOptions, useQueryWrapper } from '@/lib/config/react-query';
import { CheckoutForm } from '@/lib/types/allegro';
import { FakturowoInvoice } from '@/lib/types/api';

type DashboardDataResponse = {
  orders: {
    todayOrders: CheckoutForm[];
    yesterdayOrders: number;
    trend: 'up' | 'down';
    trendValue: number;
    lastOrders: CheckoutForm[];
  };
  revenue: {
    revenuePln: number;
    revenueHuf: number;
    revenueCzk: number;
    revenueEur: number;
    revenueTotal: number;
    trend: 'up' | 'down';
    trendValue: number;
  };
  invoices: FakturowoInvoice[];
};
const getDashboardData = async (): Promise<DashboardDataResponse> => {
  const res = await api.get(`/dashboard/data`);
  return res.data;
};

export const useDashboardData = ({ opts }: { opts?: QueryOptions<DashboardDataResponse> }) => {
  return useQueryWrapper<DashboardDataResponse>(['getDashboardData'], () => getDashboardData(), opts);
};
