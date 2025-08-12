import { Order } from '@/lib/types/api';

export const formatOrdersAnalytics = (orders: Order[]) => {
  const data = [];

  for (let i = 0; i < 12; i++) {
    const filteredOrders = orders.filter((order) => new Date(order.updatedAt).getMonth() === i);
    data.push({
      date: new Date(new Date().setMonth(i)),
      orders: filteredOrders,
    });
  }
};
