import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/lib/types/api';
import { AllegroOffer } from '@/lib/types/allegro';
import ScannerProductCard from './scanner-product-card';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const NewDelivery = ({
  products,
  handleSearchAll,
  onUpdateAll,
  setNotFoundEans,
  onUpdateOne,
  notFoundEans,
  isPending,
  updateProductStock,
}: {
  products: {
    product: Product;
    allegroProduct?: AllegroOffer;
    quantityScanned: number;
    isSynced: boolean;
  }[];
  onUpdateOne: ({ ean, stock, userId }: { ean: string; stock: number; userId: string }) => void;
  onUpdateAll: () => void;
  notFoundEans: { ean: string; quantity: number; foundOn: string[]; notFoundOn: string[] }[];
  isPending: boolean;
  setNotFoundEans: Dispatch<SetStateAction<{ ean: string; quantity: number; foundOn: string[]; notFoundOn: string[] }[]>>;
  handleSearchAll: () => void;
  updateProductStock: (ean: string, step: number) => void;
}) => {
  // console.log(products); // Debug log removed
  const [actionView, setActionView] = useState<'not_found_eans' | 'found_products'>('found_products');

  const handleAddToMarketplace = (ean: string, marketplace: string) => {
    // TODO: Implement add to marketplace functionality
    // console.log(`Adding ${ean} to ${marketplace}`); // Debug log removed

    // For now, show a toast notification
    toast.info(`Adding ${ean} to ${marketplace}`, {
      description: 'This feature is coming soon. The product will be added to the marketplace.',
      duration: 3000,
    });

    // Remove the EAN from not found list since we're "adding" it
    setNotFoundEans(
      (prev) =>
        prev
          .map((item) => {
            if (item.ean === ean) {
              // Remove this marketplace from notFoundOn and add to foundOn
              const newNotFoundOn = item.notFoundOn.filter((m) => m !== marketplace);
              const newFoundOn = [...item.foundOn, marketplace];

              // If no more notFoundOn marketplaces, remove the item entirely
              if (newNotFoundOn.length === 0) {
                return null;
              }

              return {
                ...item,
                foundOn: newFoundOn,
                notFoundOn: newNotFoundOn,
              };
            }
            return item;
          })
          .filter(Boolean) as typeof prev
    );
  };

  return (
    <>
      <div className='flex flex-col items-start gap-6 w-full'>
        <Tabs defaultValue='found_products' className='w-full'>
          <TabsList className='w-full h-12'>
            <TabsTrigger className='flex items-center gap-2' value='found_products' onClick={() => setActionView('found_products')}>
              Found Products
              {products.length > 0 && (
                <div className='h-[18px] w-[18px] rounded-full bg-primary flex items-center justify-center text-xs text-white font-semibold'>
                  {products.length}
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger className='flex items-center gap-2' value='not_found_eans' onClick={() => setActionView('not_found_eans')}>
              Not Found Eans
              {notFoundEans.length > 0 && (
                <div className='h-[18px] w-[18px] rounded-full bg-primary flex items-center justify-center text-xs text-white font-semibold'>
                  {notFoundEans.length}
                </div>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted'>
          {actionView === 'found_products' ? (
            <>
              <div className='flex flex-col gap-3 items-start w-full'>
                <p className='text-xl font-semibold'>Found Products</p>
                <div className='flex flex-col items-start gap-8 w-full max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted'>
                  {products.map((prod) => (
                    <ScannerProductCard
                      updateProductStock={updateProductStock}
                      key={prod.product.id}
                      isPending={isPending}
                      mode='update'
                      onClick={onUpdateOne}
                      prod={prod}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='flex flex-col gap-3 items-start'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-3'>
                    <p className='text-xl font-semibold'>Not Found Products (EAN's)</p>
                    {notFoundEans.length > 0 && (
                      <>
                        <Badge variant='outline' className='text-xs border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300'>
                          {notFoundEans.length} items
                        </Badge>
                        <Badge variant='outline' className='text-xs border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300'>
                          {notFoundEans.reduce((sum, item) => sum + item.quantity, 0)} total
                        </Badge>
                      </>
                    )}
                  </div>
                  {notFoundEans.length > 0 && (
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-7 px-3 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 text-red-700 dark:border-red-800 dark:text-red-300'
                      onClick={() => {
                        setNotFoundEans([]);
                        toast.success('Cleared not found EANs list');
                      }}
                    >
                      <X className='h-3 w-3 mr-1' />
                      Clear All
                    </Button>
                  )}
                </div>
                <div className='flex flex-col gap-3 items-start w-full'>
                  {notFoundEans.map((ean, index) => (
                    <div
                      key={index}
                      className='flex flex-col gap-2 w-full p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg'
                    >
                      <div className='flex items-center justify-between'>
                        <p className='font-mono text-sm font-medium'>
                          {ean.ean} x {ean.quantity}
                        </p>
                        <X
                          className='h-5 w-5 text-muted-foreground cursor-pointer hover:scale-[1.02] active:scale-[1] duration-100 ease-linear transition-all'
                          onClick={() => setNotFoundEans((prev) => prev.filter((prevEan) => prevEan !== ean))}
                        />
                      </div>

                      {/* Marketplace Status */}
                      <div className='space-y-2'>
                        {ean.foundOn.length > 0 && (
                          <div className='flex items-center gap-2'>
                            <span className='text-xs font-medium text-emerald-600 dark:text-emerald-400'>Found on:</span>
                            <div className='flex gap-1'>
                              {ean.foundOn.map((marketplace) => (
                                <span
                                  key={marketplace}
                                  className='text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-1 rounded'
                                >
                                  {marketplace}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {ean.notFoundOn.length > 0 && (
                          <div className='flex items-center gap-2'>
                            <span className='text-xs font-medium text-orange-600 dark:text-orange-400'>Not found on:</span>
                            <div className='flex gap-1'>
                              {ean.notFoundOn.map((marketplace) => (
                                <div key={marketplace} className='flex items-center gap-1'>
                                  <span className='text-xs border border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300 px-2 py-1 rounded'>
                                    {marketplace}
                                  </span>
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    className='h-5 w-5 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/50'
                                    onClick={() => handleAddToMarketplace(ean.ean, marketplace)}
                                  >
                                    <Plus className='h-3 w-3 text-orange-600 dark:text-orange-400' />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        {products && products.length > 0 && (
          <Button
            className={`${products.length > 0 ? 'w-1/2' : 'w-full'}`}
            variant={'default'}
            onClick={onUpdateAll}
            disabled={isPending || products.length === 0 || products.every((p) => p.isSynced)}
          >
            Update All
          </Button>
        )}
        <Button
          className={`${products.length > 0 ? 'w-1/2' : 'w-full'}`}
          variant={products.length > 0 ? 'outline' : 'default'}
          onClick={handleSearchAll}
          disabled={isPending}
        >
          Search for products
        </Button>
      </div>
    </>
  );
};

export default NewDelivery;
