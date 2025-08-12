import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dispatch, SetStateAction, useState } from 'react';
import { X, Package, AlertTriangle, Search, Copy, Download, Plus } from 'lucide-react';
import { Product } from '@/lib/types/api';
import { AllegroOffer } from '@/lib/types/allegro';
import ScannerProductCard from './scanner-product-card';

const StockCheck = ({
  products,
  handleSearchAll,
  onSyncAll,
  onSyncOne,
  isPending,
  updateProductStock,
  setNotFoundEans,
  notFoundEans,
}: {
  products: {
    product: Product;
    allegroProduct?: AllegroOffer;
    quantityScanned: number;
    isSynced: boolean;
  }[];
  onSyncOne: ({ ean, stock, userId }: { ean: string; stock: number; userId: string }) => void;
  onSyncAll: () => void;
  isPending: boolean;
  notFoundEans: { ean: string; quantity: number; foundOn: string[]; notFoundOn: string[] }[];
  setNotFoundEans: Dispatch<SetStateAction<{ ean: string; quantity: number; foundOn: string[]; notFoundOn: string[] }[]>>;
  handleSearchAll: () => void;
  updateProductStock: (ean: string, step: number) => void;
}) => {
  const [actionView, setActionView] = useState<'not_found_eans' | 'found_products'>('found_products');

  const allProductsSynced = products.every((p) => p.isSynced);
  const hasProducts = products.length > 0;
  const hasNotFoundEans = notFoundEans.length > 0;

  const handleCopyNotFoundEans = async () => {
    try {
      const text = notFoundEans.map((ean) => `${ean.ean} x ${ean.quantity}`).join('\n');
      await navigator.clipboard.writeText(text);

      // You can add a toast notification here if you have a toast system
      // toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = notFoundEans.map((ean) => `${ean.ean} x ${ean.quantity}`).join('\n');
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadNotFoundEans = () => {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const text = [
        `Not Found EANs Report - ${new Date().toLocaleString()}`,
        '='.repeat(50),
        '',
        'EAN Code\t\tQuantity\t\tFound On\t\tNot Found On',
        '-'.repeat(60),
        ...notFoundEans.map((ean) => `${ean.ean}\t\t${ean.quantity}\t\t${ean.foundOn.join(', ') || 'None'}\t\t${ean.notFoundOn.join(', ')}`),
        '',
        `Total Items: ${notFoundEans.length}`,
        `Total Quantity: ${notFoundEans.reduce((sum, ean) => sum + ean.quantity, 0)}`,
      ].join('\n');

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `not-found-eans-${timestamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleAddToMarketplace = (ean: string, marketplace: string) => {
    // TODO: Implement add to marketplace functionality
    console.log(`Adding ${ean} to ${marketplace}`);
  };

  return (
    <div className='flex flex-col h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 space-y-6'>
      {/* Header */}
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>Stock Management</h2>
        <p className='text-slate-600 dark:text-slate-400'>Review and sync your scanned products</p>
      </div>

      {/* Tabs */}
      <Tabs value={actionView} onValueChange={(value) => setActionView(value as 'not_found_eans' | 'found_products')} className='flex-1 flex flex-col'>
        <TabsList className='grid w-full grid-cols-2 h-14 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg'>
          <TabsTrigger
            value='found_products'
            className='flex items-center gap-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 transition-all duration-200'
          >
            <Package className='h-4 w-4' />
            <span>Found Products</span>
            {hasProducts && (
              <Badge
                variant='secondary'
                className='ml-1 h-5 px-2 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
              >
                {products.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value='not_found_eans'
            className='flex items-center gap-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 transition-all duration-200'
          >
            <AlertTriangle className='h-4 w-4' />
            <span>Not Found</span>
            {hasNotFoundEans && (
              <Badge variant='secondary' className='ml-1 h-5 px-2 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'>
                {notFoundEans.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Content Area */}
        <div className='flex-1 mt-6'>
          <TabsContent value='found_products' className='mt-0 h-full'>
            <Card className='h-full border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm'>
              <div className='p-6 h-full flex flex-col'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Scanned Products</h3>
                  {hasProducts && (
                    <Badge variant='outline' className='text-xs'>
                      {allProductsSynced ? 'All synced' : `${products.filter((p) => p.isSynced).length}/${products.length} synced`}
                    </Badge>
                  )}
                </div>

                <div className='flex-1 overflow-hidden'>
                  {hasProducts ? (
                    <div className='h-full overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600'>
                      {products.map((prod) => (
                        <div key={prod.product.id} className='transform transition-all duration-200 hover:scale-[1.01]'>
                          <ScannerProductCard updateProductStock={updateProductStock} isPending={isPending} mode='sync' onClick={onSyncOne} prod={prod} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
                      <div className='w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center'>
                        <Package className='h-8 w-8 text-slate-400' />
                      </div>
                      <div className='space-y-2'>
                        <h4 className='text-lg font-medium text-slate-900 dark:text-slate-100'>No products found</h4>
                        <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm'>
                          Start scanning products or search your inventory to begin stock management.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value='not_found_eans' className='mt-0 h-full'>
            <Card className='h-full border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm'>
              <div className='p-6 h-full flex flex-col'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Unrecognized EANs</h3>
                  <div className='flex items-center gap-3'>
                    {hasNotFoundEans && (
                      <Badge variant='outline' className='text-xs border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300'>
                        {notFoundEans.length} items
                      </Badge>
                    )}
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-7 px-3 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        onClick={handleCopyNotFoundEans}
                        disabled={!hasNotFoundEans}
                      >
                        <Copy className='h-3 w-3 mr-1' />
                        Copy All
                      </Button>
                      <Button
                        variant='default'
                        size='sm'
                        className='h-7 px-3 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        onClick={handleDownloadNotFoundEans}
                        disabled={!hasNotFoundEans}
                      >
                        <Download className='h-3 w-3 mr-1' />
                        Download TXT
                      </Button>
                    </div>
                  </div>
                </div>

                <div className='flex-1 overflow-hidden'>
                  {hasNotFoundEans ? (
                    <div className='h-full overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600'>
                      {notFoundEans.map((ean, index) => (
                        <div
                          key={index}
                          className='p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg group hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200'
                        >
                          <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center space-x-3'>
                              <div className='w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center'>
                                <AlertTriangle className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                              </div>
                              <div>
                                <p className='font-mono text-sm font-medium text-slate-900 dark:text-slate-100'>{ean.ean}</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>Quantity: {ean.quantity}</p>
                              </div>
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/50'
                              onClick={() => setNotFoundEans((prev) => prev.filter((prevEan) => prevEan !== ean))}
                            >
                              <X className='h-4 w-4 text-red-500' />
                            </Button>
                          </div>

                          {/* Marketplace Status */}
                          <div className='space-y-2'>
                            {ean.foundOn.length > 0 && (
                              <div className='flex items-center gap-2'>
                                <span className='text-xs font-medium text-emerald-600 dark:text-emerald-400'>Found on:</span>
                                <div className='flex gap-1'>
                                  {ean.foundOn.map((marketplace) => (
                                    <Badge
                                      key={marketplace}
                                      variant='secondary'
                                      className='text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                    >
                                      {marketplace}
                                    </Badge>
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
                                      <Badge
                                        variant='outline'
                                        className='text-xs border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300'
                                      >
                                        {marketplace}
                                      </Badge>
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
                  ) : (
                    <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
                      <div className='w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center'>
                        <Package className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                      </div>
                      <div className='space-y-2'>
                        <h4 className='text-lg font-medium text-slate-900 dark:text-slate-100'>All EANs recognized</h4>
                        <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm'>Great! All scanned products were found in your inventory.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Action Button */}
      <div className='pt-4 border-t border-slate-200 dark:border-slate-700'>
        {hasProducts ? (
          <Button
            onClick={onSyncAll}
            disabled={isPending || !hasProducts || allProductsSynced}
            className='w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-600 dark:disabled:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none'
          >
            {isPending ? (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                <span>Syncing...</span>
              </div>
            ) : allProductsSynced ? (
              'All Products Synced'
            ) : (
              `Sync All Products (${products.length})`
            )}
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSearchAll();
            }}
            onMouseDown={(e) => e.preventDefault()}
            disabled={isPending}
            variant='outline'
            className='w-full h-12 text-base font-medium border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200'
          >
            {isPending ? (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin' />
                <span>Searching...</span>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Search className='h-4 w-4' />
                <span>Search for Products</span>
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StockCheck;
