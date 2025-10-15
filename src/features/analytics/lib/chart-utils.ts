import { Order } from '@/lib/types/api';

type OrdersAnalyticsPoint = {
  date: Date;
  orders: Order[];
};

export const formatOrdersAnalytics = (orders: Order[]): OrdersAnalyticsPoint[] => {
  const data: OrdersAnalyticsPoint[] = [];

  for (let i = 0; i < 12; i++) {
    const filteredOrders = orders.filter((order) => new Date(order.updatedAt).getMonth() === i);
    data.push({
      date: new Date(new Date().setMonth(i)),
      orders: filteredOrders,
    });
  }

  return data;
};
