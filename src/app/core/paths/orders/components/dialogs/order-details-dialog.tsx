import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrder } from '@/features/orders/get-order-by-id';
import { OrderStatus } from '@/lib/types/allegro';
import { DialogDetailsProps } from '@/lib/types/common';
import { parseOrderStatus } from '@/lib/utils';
import { Loader2, Package } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

const BODY_TABS = [
  { label: 'Delivery', value: 'delivery', icon: '🚗' },
  { label: 'Payments', value: 'payments', icon: '💳' },
  { label: 'Products', value: 'products', icon: '📦' },
];

const OrderDetailsDialog = ({ open, setOpen, id }: DialogDetailsProps) => {
  const { data, isLoading } = useOrder({
    id,
    opts: {
      enabled: !!id && id !== '',
    },
  });
  const [activeTab, setActiveTab] = useState<string>('delivery');
  const { t } = useTranslation();
  const statusUtils = useMemo(() => {
    if (data) {
      return parseOrderStatus((data?.fulfillment?.status as OrderStatus) ?? 'NEW');
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      {isLoading ? (
        <DialogContent className='sm:max-w-5xl w-full h-[650px] flex flex-col items-center justify-center gap-4'>
          <Loader2 className='h-24 w-24 text-primary animate-spin' />
          <p className='text-lg font-semibold'>Loading Order</p>
        </DialogContent>
      ) : (
        <DialogContent className='sm:max-w-5xl w-full flex flex-col gap-6'>
          <DialogHeader className='flex flex-col items-start gap-1'>
            <DialogTitle className='text-2xl font-bold'>{t('orders.details.title')}</DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>{t('orders.details.description')}</DialogDescription>
          </DialogHeader>
          <div className='flex items-center gap-5 pb-3 border-b border-border w-full'>
            <div className='h-28 w-28 rounded-xl flex items-center justify-center bg-primary/10 border border-border text-primary'>
              <Package className='h-10 w-10' />
            </div>
            <div className='flex flex-col items-start justify-between pt-1.5 h-28'>
              <div className='flex flex-col items-start gap-0.5'>
                <p className='text-lg  font-semibold'>Order #{data?.id}</p>
                <div className={`${statusUtils?.className} px-2 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold`}>
                  {statusUtils && (
                    <>
                      <statusUtils.icon className='h-3.5 w-3.5' />
                      <p>{statusUtils.text}</p>
                    </>
                  )}
                </div>
              </div>
              <p className='text-xl font-bold'>
                {data?.summary?.totalToPay?.amount} {data?.summary?.totalToPay?.currency}
              </p>
            </div>
          </div>
          <Tabs className='gap-0 h-full'>
            <TabsList defaultValue={activeTab} className='w-full  bg-transparent p-0 border-b border-border rounded-b-none'>
              {BODY_TABS.map((tab) => (
                <TabsTrigger
                  className={`${
                    activeTab === tab.value ? 'bg-secondary dark:bg-secondary' : ''
                  } rounded-t-xl py-6 flex items-center gap-3 cursor-pointer duration-100 ease-linear transition-colors`}
                  value={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                >
                  <p>{tab.icon}</p>
                  <p>{tab.label}</p>
                </TabsTrigger>
              ))}
            </TabsList>
            {BODY_TABS.map((tab) => (
              <TabsContent value={tab.value} className='p-6 bg-secondary dark:bg-secondary border border-t-0 border-border rounded-b-xl min-h-[500px]'>
                asd
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default OrderDetailsDialog;
