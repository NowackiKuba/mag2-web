import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import { QueryProvider } from '@/lib/config/react-query';
import { ThemeProvider } from '@/lib/config/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import AuthLayout from '@/app/auth/root';
import AppLayout from './app/core/root';
import { ClimbingBoxLoader } from 'react-spinners';
const Login = lazy(() => import('@/app/auth/paths/login'));
const Register = lazy(() => import('@/app/auth/paths/register'));
const BusinessInfo = lazy(() => import('@/app/auth/paths/business-info'));

const Dashboard = lazy(() => import('@/app/core/paths/dashboard/dashboard'));
const Orders = lazy(() => import('@/app/core/paths/orders/orders'));
const Order = lazy(() => import('@/app/core/paths/order/order'));
const Integrations = lazy(() => import('@/app/core/paths/integrations/integrations'));
const IntegrationMiddleware = lazy(() => import('@/app/core/paths/integrations/middleware'));
const Products = lazy(() => import('@/app/core/paths/products/products'));
const Product = lazy(() => import('@/app/core/paths/product/product'));
const Automations = lazy(() => import('@/app/core/paths/automations/automations'));
const Invoices = lazy(() => import('@/app/core/paths/invoices/invoices'));
const Analytics = lazy(() => import('@/app/core/paths/analytics/analytics'));

const Loader = () => (
  <div className='w-full h-screen flex flex-col items-center justify-center'>
    <ClimbingBoxLoader size={25} color='#3b82f6' />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<Loader />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'business-data',
        element: (
          <Suspense fallback={<Loader />}>
            <BusinessInfo />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<Loader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<Loader />}>
            <Orders />
          </Suspense>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <Order />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<Loader />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <Product />
          </Suspense>
        ),
      },
      {
        path: 'integrations',
        element: (
          <Suspense fallback={<Loader />}>
            <Integrations />
          </Suspense>
        ),
      },
      {
        path: 'automations',
        element: (
          <Suspense fallback={<Loader />}>
            <Automations />
          </Suspense>
        ),
      },
      {
        path: 'invoices',
        element: (
          <Suspense fallback={<Loader />}>
            <Invoices />
          </Suspense>
        ),
      },
      {
        path: 'integrations/middleware',
        element: (
          <Suspense fallback={<Loader />}>
            <IntegrationMiddleware />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<Loader />}>
            <Analytics />
          </Suspense>
        ),
      },
    ],
  },
]);

export function Router() {
  return (
    <QueryProvider>
      <ThemeProvider storageKey='vite-ui-theme' defaultTheme='dark'>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  );
}
