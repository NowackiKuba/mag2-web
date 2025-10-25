import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useMarketplaceDetails } from '@/features/products/get-marketplace-details';
import { ProductSource } from '@/lib/types/api';
import { ScannerProd } from '@/lib/types/common';

import { Copy, Minus, PackagePlus, Plus, Shuffle, Tag, Package } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const ScannerProductCard = ({
  prod,
  isPending,
  onClick,
  mode,
  updateProductStock,
}: {
  prod: ScannerProd;
  isPending: boolean;
  mode: 'update' | 'sync';
  onClick: ({ ean, stock, userId }: { ean: string; stock: number; userId: string }) => void;
  updateProductStock: (ean: string, step: number) => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (src: ProductSource) => {
    searchParams.set('detailsSource', src);
    setSearchParams(searchParams);
  };
  const detailsMarketplace = useMemo<ProductSource>(() => {
    return searchParams.get('detailsSource') ? (searchParams.get('detailsSource')! as ProductSource) : ProductSource.ALLEGRO;
  }, [searchParams]);

  const { data: details, isLoading } = useMarketplaceDetails({
    source: detailsMarketplace,
    id: prod?.product?.externalAllegroId,
    opts: {
      enabled: !!detailsMarketplace,
    },
  });

  // console.log(prod.product); // Debug log removed

  return (
    <div className='bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 p-6'>
      {/* Header Section */}
      <div className='flex items-start justify-between mb-6 w-full'>
        <div className='flex-1 w-full'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white leading-tight'>{prod.product.name}</h3>
          </div>
          <div className='w-full items-center justify-between flex'>
            <div className='flex items-center gap-3'>
              <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>EAN: {prod?.product.ean}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${prod.product.ean}`);
                  toast.info('EAN copied to clipboard', { duration: 2000 });
                }}
                className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                <Copy className='h-4 w-4 text-gray-500 dark:text-gray-400' />
              </button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>LOOL</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleFilter(ProductSource.ERLI)}>ERLI</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilter(ProductSource.ALLEGRO)}>ALLEGRO</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className='flex items-center bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600 overflow-hidden'>
          <button
            onClick={() => {
              if (prod.quantityScanned > 0) {
                updateProductStock(prod.product.ean, -1);
              }
            }}
            disabled={prod.quantityScanned <= 1}
            className='flex items-center justify-center w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Minus className='h-4 w-4 text-gray-600 dark:text-gray-400' />
          </button>

          <div className='flex items-center justify-center min-w-[3rem] h-10 px-4 border-x border-gray-200 dark:border-gray-600'>
            <span className='font-semibold text-gray-900 dark:text-white'>{prod.quantityScanned}</span>
          </div>

          <button
            onClick={() => {
              updateProductStock(prod.product.ean, 1);
            }}
            className='flex items-center justify-center w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
          >
            <Plus className='h-4 w-4 text-gray-600 dark:text-gray-400' />
          </button>
        </div>
      </div>

      {/* Data Comparison Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 items-center'>
        {/* App Data Card */}
        <div className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-2xl border border-blue-200 dark:border-blue-800 p-5'>
          <div className='flex items-center gap-4 mb-3'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
              <Package className='w-6 h-6 text-white' />
            </div>
            <div>
              <h4 className='font-bold text-gray-900 dark:text-white'>App Data</h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Internal inventory</p>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Stock:</span>
              <span className='font-semibold text-gray-900 dark:text-white'>{prod.product.stock}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Price:</span>
              <span className='font-semibold text-gray-900 dark:text-white'>{prod.product?.costHistory?.[0].unitPrice} CURRENCY</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className='flex justify-center lg:py-8'>
          <Button
            disabled={isPending || prod.isSynced}
            onClick={() => {
              onClick({
                ean: prod.product.ean,
                stock: prod.quantityScanned,
                userId: '',
              });
            }}
            className={`
              w-16 h-16 rounded-2xl shadow-lg transition-all duration-200 
              ${
                mode === 'sync'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                  : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              }
              disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95
            `}
          >
            {mode === 'sync' ? <Shuffle className='w-6 h-6 text-white' /> : <PackagePlus className='w-6 h-6 text-white' />}
          </Button>
        </div>

        {/* Marketplace Data Card */}
        {isLoading ? (
          <Skeleton
            className={`
          rounded-2xl border p-5 h-40
          
            `}
          />
        ) : (
          <div
            className={`
            rounded-2xl border p-5
            ${
              details?.source === 'ALLEGRO'
                ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800'
                : details?.source === 'ERLI'
                ? 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 border-teal-200 dark:border-teal-800'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }
              `}
          >
            <div className='flex items-center gap-4 mb-3'>
              <div
                className={`
                w-12 h-12 rounded-xl flex items-center justify-center shadow-lg
                ${
                  details?.source === 'ALLEGRO'
                    ? 'bg-gradient-to-br from-orange-500 to-red-600'
                    : details?.source === 'ERLI'
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-600'
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }
                  `}
              >
                <Tag className='w-6 h-6 text-white' />
              </div>
              <div>
                <h4 className='font-bold text-gray-900 dark:text-white capitalize'>{details?.source} Data</h4>
                <p className='text-sm text-gray-600 dark:text-gray-400'>External platform</p>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Stock:</span>
                <span className='font-semibold text-gray-900 dark:text-white'>{details?.stock || 'N/A'}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Price:</span>
                <span className='font-semibold text-gray-900 dark:text-white'>
                  {details?.price || 'N/A'} {details?.currency || ''}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sync Status Indicator */}
      {prod.isSynced && (
        <div className='mt-4 flex items-center justify-center gap-2 text-green-600 dark:text-green-400'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          <span className='text-sm font-medium'>Synced</span>
        </div>
      )}
    </div>
  );
};

export default ScannerProductCard;
