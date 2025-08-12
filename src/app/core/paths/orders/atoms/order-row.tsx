import StatusBadge from '@/app/core/components/atoms/status-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { CheckoutForm } from '@/lib/types/allegro';
import { OrderStatus } from '@/lib/types/api';
import { parseOrderStatus } from '@/lib/utils';
import { format } from 'date-fns';
import { HelpCircle } from 'lucide-react';
import { useMemo } from 'react';

const OrderRow = ({ order, onClick }: { order: CheckoutForm; onClick: () => void }) => {
  const styles = useMemo(() => {
    if (order) {
      const data = parseOrderStatus((order?.fulfillment?.status as OrderStatus) ?? 'NEW');
      if (data?.icon && data?.animation && data?.className && data?.text) {
        return data;
      }
      return {
        icon: HelpCircle,
        className: 'bg-gray-500/20 text-gray-200',
        text: 'New',
        animation: '',
      };
    }
  }, [order]);

  return (
    <>
      <TableRow onClick={onClick} key={order.id} className='h-12'>
        <TableCell className='text-left'>{order.id.slice(0, 4)}...</TableCell>
        <TableCell className='flex'>
          <div
            className={`${styles?.className} ${styles?.animation ? styles.animation : ''} flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full`}
          >
            {styles?.icon && <styles.icon className='h-3.5 w-3.5' />}
            {order?.fulfillment?.status.toString()}
          </div>
          <StatusBadge status={order?.fulfillment?.status ?? 'NEW'} />
        </TableCell>
        <TableCell>{order.delivery.method.name}</TableCell>
        <TableCell>
          {order.summary.totalToPay.amount} {order.summary.totalToPay.currency}
        </TableCell>
        <TableCell>{format(order.updatedAt, 'dd.MM.yyyy, HH:mm')}</TableCell>
      </TableRow>
    </>
  );
};

export default OrderRow;
