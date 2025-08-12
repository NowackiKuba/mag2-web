import { useMe } from '@/features/user/get-me';
import StatCard from './components/cards/StatCard';
import { ArrowRight, Bot, CreditCard, FileText, Package, Tags } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDashboardData } from '@/features/dashboard/get-dashboard-data';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data } = useMe({});
  const { data: dashboardData, isLoading } = useDashboardData({});
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-6 w-full'>
      <p className='text-3xl font-bold'>
        {t('app.welcome')}, <span className='text-primary'>{data?.username} 👋🏻</span>
      </p>
      <div className='w-full flex items-start gap-6'>
        <div className='h-[724px] w-1/4 bg-secondary border p-6 border-border rounded-xl shadow-md flex flex-col items-start gap-4'>
          <div className='flex items-end justify-between w-full'>
            <p className='text-xl font-bold'>{t('dashboard.lastOrders')}</p>
          </div>
          <div className='flex flex-col items-start gap-2.5 w-full h-full'>
            {dashboardData?.orders.lastOrders.map((order) => (
              <Link
                to={`/app/orders/${order.id}`}
                key={order.id}
                className='w-full h-1/4 p-4 bg-white shadow-md dark:bg-muted/50 border border-border rounded-lg flex flex-col items-start justify-between'
              >
                <div className='flex flex-col items-start'>
                  <p className='text-lg font-semibold'>Order #{order.id.slice(order.id.length - 4, order.id.length).toUpperCase()}</p>
                  <p className='text-sm text-muted-foreground'>{format(order.updatedAt, 'dd/MM/yyyy, HH:mm')}</p>
                </div>
                <p className='text-2xl font-bold'>
                  {order?.summary?.totalToPay?.amount} {order?.summary?.totalToPay?.currency}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className='h-[724px] w-3/4  flex flex-col gap-6'>
          <div className='w-full h-3/4 flex items-center gap-6'>
            <StatCard
              isLoading={isLoading}
              className='w-full h-full shadow-md'
              color='blue'
              icon={Package}
              text={t('dashboard.orders')}
              value={dashboardData?.orders?.todayOrders?.length.toString() ?? '0'}
              showTrend
              trend={dashboardData?.orders?.trend}
              trendValue={dashboardData?.orders?.trendValue.toFixed(2)}
            />
            <StatCard
              isLoading={isLoading}
              className='w-full h-full py-4 bg-secondary border border-border rounded-xl shadow-md'
              color='indigo'
              icon={CreditCard}
              text={t('dashboard.income')}
              value={dashboardData?.revenue?.revenueTotal.toFixed(2) ?? '0'}
              valueUnit='PLN'
              showTrend
              trend={dashboardData?.revenue?.trend}
              trendValue={dashboardData?.revenue?.trendValue.toFixed(2)}
            />
            <StatCard
              isLoading={isLoading}
              className='w-full h-full py-4 bg-secondary border border-border rounded-xl shadow-md'
              color='purple'
              icon={FileText}
              text={t('dashboard.invoices')}
              value={dashboardData?.invoices?.length.toString() ?? '0'}
            />
          </div>
          <div className='w-full h-full bg-secondary border border-border rounded-xl shadow-md flex flex-col items-start gap-2 p-5'>
            <p className='text-xl font-bold'>{t('dashboard.shortcuts')}</p>
            <div className='flex items-center gap-2 h-full w-full'>
              <Link
                to={'/app/products'}
                className='h-full w-full rounded-xl border border-border bg-gradient-to-b from-white/5 to-muted/30 flex flex-col items-start justify-between p-6 hover:shadow-md transition-all duration-200 group cursor-pointer'
              >
                <div className='h-12 w-12 rounded-full border-2 border-border/50 flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-sm group-hover:scale-105 transition-transform duration-200'>
                  <Tags className='text-primary h-6 w-6' />
                </div>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-lg font-semibold'>Products</p>
                    <div className='h-1 w-16 bg-primary/20 rounded-full'></div>
                  </div>
                  <ArrowRight className='h-5 w-5 group-hover:translate-x-2 duration-100 ease-linear transition-all' />
                </div>
              </Link>
              <Link
                to={'/app/automations'}
                className='h-full w-full rounded-xl border border-border bg-gradient-to-b from-white/5 to-muted/30 flex flex-col items-start justify-between p-6 hover:shadow-md transition-all duration-200 group cursor-pointer'
              >
                <div className='h-12 w-12 rounded-full border-2 border-border/50 flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-sm group-hover:scale-105 transition-transform duration-200'>
                  <Bot className='text-primary h-6 w-6' />
                </div>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-lg font-semibold'>Automations</p>
                    <div className='h-1 w-16 bg-primary/20 rounded-full'></div>
                  </div>
                  <ArrowRight className='h-5 w-5 group-hover:translate-x-2 duration-100 ease-linear transition-all' />
                </div>
              </Link>
              <Link
                to={'/app/orders'}
                className='h-full w-full rounded-xl border border-border bg-gradient-to-b from-white/5 to-muted/30 flex flex-col items-start justify-between p-6 hover:shadow-md transition-all duration-200 group cursor-pointer'
              >
                <div className='h-12 w-12 rounded-full border-2 border-border/50 flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-sm group-hover:scale-105 transition-transform duration-200'>
                  <Package className='text-primary h-6 w-6' />
                </div>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-lg font-semibold'>Orders</p>
                    <div className='h-1 w-16 bg-primary/20 rounded-full'></div>
                  </div>
                  <ArrowRight className='h-5 w-5 group-hover:translate-x-2 duration-100 ease-linear transition-all' />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-start gap-6 w-full h-[212px]'>
        <div className='w-full h-full bg-secondary border border-border rounded-xl shadow-md'></div>
        <div className='w-full h-full bg-secondary border border-border rounded-xl shadow-md'></div>
      </div>
    </div>
  );
};

export default Dashboard;
