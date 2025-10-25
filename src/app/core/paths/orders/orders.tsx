import PageTitle from '../../components/atoms/page-title';
import { ChevronDown, Package } from 'lucide-react';

import { useUserOrders } from '@/features/user/get-user-orders';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LocalSearchbar from '@/components/local-searchbar';
import { useTranslation } from 'react-i18next';
import { lazy, useState, useRef, useEffect } from 'react';
import FilterSelector from '@/components/filter-selector';
import { IntegrationPlatform, OrderStatus, ProductSource } from '@/lib/types/api';
import StatusBadge from '../../components/atoms/status-badge';
// import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { colorSchemes, MARKETPLACES } from '@/lib/constants';
import RemoveFiltersButton from '@/components/atoms/remove-filters-button';
import { Button } from '@/components/ui/button';

const OrderDetailsDialog = lazy(() => import('./components/dialogs/order-details-dialog'));

const Orders = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams?.get('page') ? +searchParams.get('page')! : 1;
  const search = searchParams?.get('q') ? searchParams.get('q')! : undefined;
  const status = searchParams?.get('status') ? searchParams.get('status')! : undefined;
  const marketplace = searchParams?.get('source') ? searchParams.get('source')! : undefined;

  // Track if this is the initial loads
  const isInitialLoadRef = useRef(true);

  const { data, isLoading, isFetching } = useUserOrders({
    queryProps: {
      page,
      pageSize: 9,
      search,
      status,
      source: marketplace as IntegrationPlatform,
    },
  });

  const { t } = useTranslation();

  const [selectedOrderId] = useState<string>('');
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const navigate = useNavigate();

  // console.log(data); // Debug log removed

  useEffect(() => {
    if (data && isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }
  }, [data]);

  // console.log(data); // Debug log removed

  if (isLoading) {
    return (
      <div className='flex flex-col items-start gap-6 w-full h-full'>
        <PageTitle icon={Package} title={t('orders.title')} label={t('orders.description')} />
        <div className='flex items-center justify-between w-full'>
          <LocalSearchbar disabled iconPosition='left' placeholder={t('orders.search')} className='max-w-[400px]' />
          <div className='flex items-center gap-3'>
            <FilterSelector
              disabled
              options={Object.values(OrderStatus).map((status) => ({
                label: status[0] + status.slice(1).replaceAll('_', ' ').toLowerCase(),
                value: status,
              }))}
              queryKey='status'
              placeholder='Filter by status'
            />
          </div>
        </div>
        <Skeleton className='w-full h-full' />
      </div>
    );
  }
  return (
    <div className='flex flex-col items-start gap-6 w-full h-full'>
      <div className='flex items-center justify-between w-full'>
        <PageTitle icon={Package} title={t('orders.title')} label={t('orders.description')} />
        <Button className='flex items-center gap-2'>
          More Actions
          <ChevronDown />
        </Button>
      </div>
      <div className='flex items-center justify-between w-full'>
        <LocalSearchbar iconPosition='left' placeholder={t('orders.search')} className='max-w-[400px]' />
        <div className='flex items-center gap-3'>
          {(status || marketplace) && <RemoveFiltersButton keys={['source', 'status']} text='Remove Filters' />}
          <FilterSelector
            options={Object.values(OrderStatus).map((status) => ({
              label: status[0] + status.slice(1).replaceAll('_', ' ').toLowerCase(),
              value: status,
            }))}
            queryKey='status'
            placeholder='Filter by status'
          />
          <FilterSelector
            options={Object.values(ProductSource).map((source) => ({
              label: source[0] + source.slice(1).replaceAll('_', ' ').toLowerCase(),
              value: source,
            }))}
            queryKey='source'
            placeholder='Filter by source'
          />
        </div>
      </div>

      <div className='w-full h-full p-5 bg-secondary border border-border flex rounded-xl'>
        <div className='flex flex-col items-start w-full justify-between h-full'>
          <div className='flex flex-col items-start gap-2 w-full'>
            <p className='text-lg font-semibold'>
              Showing {9 * page} of {data?.total}
            </p>
            {/* Show inline loading indicator for subsequent fetches */}
            {isFetching && !isLoading && <div className='w-full text-center text-sm text-muted-foreground py-2'>Updating data...</div>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-left'>{t('orders.id')}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>{t('orders.source')}</TableHead>
                  <TableHead>{t('orders.deliveryMethod')}</TableHead>
                  <TableHead>{t('orders.totalToPay')}</TableHead>
                  <TableHead>{t('orders.lastUpdate')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.orders.map((order) => (
                  <TableRow key={order.id} className='h-12' onClick={() => navigate(`./${order.id}`)}>
                    <TableCell className='text-left'>{order.id.slice(0, 4)}...</TableCell>
                    <TableCell className='flex'>{order?.status ? <StatusBadge status={order.status} /> : <StatusBadge status='NEW' />}</TableCell>
                    <TableCell className={`${colorSchemes[MARKETPLACES[order.source].scheme].text}`}>{order?.source}</TableCell>
                    <TableCell>{order.delivery.method}</TableCell>
                    <TableCell>
                      {order.totalAmount} {order.currency}
                    </TableCell>
                    {/* <TableCell>{format(order.updatedAt, 'dd.MM.yyyy, HH:mm')}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='flex items-center justify-end w-full'>
            <Pagination isNext={page < (data?.totalPages ?? 0)} page={page} />
          </div>
        </div>
      </div>
      {openDetails && <OrderDetailsDialog id={selectedOrderId} open={openDetails} setOpen={setOpenDetails} />}
    </div>
  );
};

export default Orders;
