import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ListChecks, PackageOpen, Scan, ArrowRight, Zap, Search, Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
import PersistentFocusInput from './scanner-input';
import StockCheck from './stock-check';
import NewDelivery from './new-delivery';
import { DialogProps, ScannerProd } from '@/lib/types/common';
import { getProductsByEan, ScannerResult } from '@/features/products/get-by-eans';
import { toast } from 'sonner';
import { useSyncProducts } from '@/features/products/sync-products-stock';

const ScannerDialog: React.FC<DialogProps> = ({ open, setOpen }) => {
  const [action, setAction] = useState<'order' | 'stock' | ''>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<ScannerProd[]>([]);
  const [notFoundEans, setNotFoundEans] = useState<{ ean: string; quantity: number; foundOn: string[]; notFoundOn: string[] }[]>([]);
  const [eansList, setEansList] = useState<string[]>([]);
  const inputTimer = useRef<NodeJS.Timeout | null>(null);

  const updateProductStock = (ean: string, step: number) => {
    setProducts((currentProducts) =>
      currentProducts.map((prod) => (prod.product.ean === ean ? { ...prod, quantityScanned: prod.quantityScanned + step } : prod))
    );
  };

  const { mutateAsync: sync, isPending } = useSyncProducts({
    opts: {
      override_onSuccess: () => {
        toast.success('Successfully synced products');
      },
    },
  });

  useEffect(() => {
    if (action && inputRef.current) {
      inputRef.current.focus();
    }
  }, [action]);

  useEffect(() => {
    setInputValue('');
  }, [eansList]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.length > 0 && !isProcessing) {
      if (inputTimer.current) {
        clearTimeout(inputTimer.current);
      }
      setEansList((prev) => [...prev, inputValue]);
      inputRef.current?.focus();
    }
  };

  const handleAddToNotFound = (ean: string) => {
    // Check if EAN is already in the list
    const existing = notFoundEans.find((item) => item.ean === ean);
    if (existing) {
      existing.quantity += 1;
      setNotFoundEans([...notFoundEans]);
    } else {
      setNotFoundEans((prev) => [
        ...prev,
        {
          ean,
          quantity: 1,
          foundOn: [],
          notFoundOn: ['ALLEGRO', 'ERLI'], // Default to all marketplaces
        },
      ]);
    }
  };

  const handleSearchProducts = async () => {
    setIsProcessing(true);
    let failed = 0;
    let succeed = 0;

    try {
      const result: ScannerResult = await getProductsByEan(eansList);

      // First, count how many times each EAN was actually scanned
      const eanScanCounts = new Map<string, number>();
      eansList.forEach((ean) => {
        eanScanCounts.set(ean, (eanScanCounts.get(ean) || 0) + 1);
      });
      console.log('EAN scan counts:', Object.fromEntries(eanScanCounts));

      // Process found products - group by EAN to avoid duplicates
      const productsByEan = new Map<string, ScannerProd>();

      // Group products by EAN first to avoid duplicates from backend
      const productsByEanFromBackend = new Map<string, typeof result.foundProducts>();
      result.foundProducts.forEach((product) => {
        if (!productsByEanFromBackend.has(product.ean)) {
          productsByEanFromBackend.set(product.ean, []);
        }
        productsByEanFromBackend.get(product.ean)!.push(product);
      });

      // Now process each unique EAN
      productsByEanFromBackend.forEach((products, ean) => {
        // Get the actual scan count for this EAN
        const quantityScanned = eanScanCounts.get(ean) || 0;
        console.log(`EAN ${ean}: scanned ${quantityScanned} times, found ${products.length} products`);

        // Use the first product as the base, but collect all sources
        const baseProduct = products[0];
        const allSources = products.map((p) => p.source);

        productsByEan.set(ean, {
          product: baseProduct,
          sources: allSources,
          quantityScanned,
          isSynced: false,
        });
      });

      // Convert map to array
      const uniqueProducts = Array.from(productsByEan.values());
      console.log('Unique products after processing:', uniqueProducts);

      setProducts((prev) => {
        // Merge with existing products, combining quantities for same EANs
        const existingProductsMap = new Map<string, ScannerProd>();

        // Add existing products to map
        prev.forEach((prod) => {
          existingProductsMap.set(prod.product.ean, prod);
        });

        // Merge new products with existing ones
        uniqueProducts.forEach((newProd) => {
          const existing = existingProductsMap.get(newProd.product.ean);
          if (existing) {
            existing.quantityScanned += newProd.quantityScanned;
            // Merge sources
            if (newProd.sources) {
              newProd.sources.forEach((source) => {
                if (existing.sources && !existing.sources.includes(source)) {
                  existing.sources.push(source);
                } else if (!existing.sources) {
                  existing.sources = [source];
                }
              });
            }
          } else {
            existingProductsMap.set(newProd.product.ean, newProd);
          }
        });

        return Array.from(existingProductsMap.values());
      });

      succeed = uniqueProducts.length;

      // Get all found EANs to filter out from not found list
      const foundEans = new Set(uniqueProducts.map((p) => p.product.ean));
      console.log('Found EANs:', Array.from(foundEans));
      console.log('Original not found EANs from backend:', result.notFoundEans);

      // Process not found EANs with marketplace information
      const notFoundEansList = result.notFoundEans
        .map((item) => {
          // Get the actual scan count for this EAN
          const quantity = eanScanCounts.get(item.ean) || 0;
          console.log(`Processing not found item for EAN ${item.ean}: scanned ${quantity} times, foundOn=${item.foundOn}, notFoundOn=${item.notFoundOn}`);

          return {
            ean: item.ean,
            quantity,
            foundOn: item.foundOn,
            notFoundOn: item.notFoundOn,
          };
        })
        .filter((item) => {
          // Keep items that are either:
          // 1. Not found on any marketplace (notFoundOn.length > 0 and foundOn.length === 0)
          // 2. Found on some marketplaces but missing on others (notFoundOn.length > 0)
          return item.notFoundOn.length > 0;
        });

      console.log('Filtered not found EANs:', notFoundEansList);

      // Add not found EANs to state
      if (notFoundEansList.length > 0) {
        setNotFoundEans((prev) => {
          const combined = [...prev];
          notFoundEansList.forEach((newItem) => {
            const existing = combined.find((item) => item.ean === newItem.ean);
            if (existing) {
              existing.quantity += newItem.quantity;
              // Merge marketplace information
              existing.foundOn = [...new Set([...existing.foundOn, ...newItem.foundOn])];
              existing.notFoundOn = [...new Set([...existing.notFoundOn, ...newItem.notFoundOn])];
            } else {
              combined.push(newItem);
            }
          });
          return combined;
        });
      }

      // Calculate total failed quantity (sum of all quantities, not just count of unique EANs)
      failed = notFoundEansList.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.log('ERROR', error);
      // If there's an error, treat all EANs as not found
      const eanScanCounts = new Map<string, number>();
      eansList.forEach((ean) => {
        eanScanCounts.set(ean, (eanScanCounts.get(ean) || 0) + 1);
      });

      const notFoundEansList = Array.from(eanScanCounts.entries()).map(([ean, quantity]) => ({
        ean,
        quantity: quantity,
        foundOn: [],
        notFoundOn: ['ALLEGRO', 'ERLI'], // Assume all marketplaces failed
      }));

      setNotFoundEans((prev) => {
        const combined = [...prev];
        notFoundEansList.forEach((newItem) => {
          const existing = combined.find((item) => item.ean === newItem.ean);
          if (existing) {
            existing.quantity += newItem.quantity;
          } else {
            combined.push(newItem);
          }
        });
        return combined;
      });
      // Calculate total failed quantity in error case
      failed = notFoundEansList.reduce((total, item) => total + item.quantity, 0);

      // Show error toast
      toast.error('Failed to search products', {
        description: 'Some products could not be found. Check the "Not Found" tab for details.',
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
      toast.success('Scanned products', {
        description: `Found ${succeed} unique products, ${failed} items not found`,
        richColors: true,
      });
      setEansList([]);
    }
  };

  const handleSyncAll = async () => {
    await Promise.all(
      products.map(async (prod) => {
        if (prod.isSynced) {
          return;
        }
        await sync({
          id: prod.product.externalAllegroId,
          sources: prod?.sources?.map((src) => src.toString()) ?? [],
          stock: prod.quantityScanned,
        });
      })
    );
  };

  const handleUpdateAll = () => {
    // products.forEach((prod) => {
    //   if (!prod.isSynced) {
    //     update({
    //       ean: prod.product.ean,
    //       stock: prod.quantityScanned,
    //       userId: userId!,
    //     });
    //   }
    // });
  };

  useEffect(() => {
    setEansList([]);
    setNotFoundEans([]);
    setProducts([]);
  }, [action]);

  const getActionTitle = () => {
    switch (action) {
      case 'order':
        return 'New Delivery';
      case 'stock':
        return 'Stock Check';
      default:
        return 'Scanner Operations';
    }
  };

  const getActionSubtitle = () => {
    switch (action) {
      case 'order':
        return 'Process incoming delivery and update inventory';
      case 'stock':
        return 'Verify and sync product quantities';
      default:
        return 'Choose your scanning operation';
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
          setAction('');
        }
      }}
    >
      <DialogContent className='sm:max-w-6xl w-full h-[90vh] flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-0 shadow-2xl'>
        <DialogHeader className='flex-shrink-0 border-b border-slate-200 dark:border-slate-700 pb-6'>
          <div className='flex items-center gap-4'>
            {action && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setAction('')}
                className='h-9 w-9 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
            )}
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg'>
                <Scan className='h-5 w-5 text-white' />
              </div>
              <div>
                <DialogTitle className='text-2xl font-bold text-slate-900 dark:text-slate-100'>{getActionTitle()}</DialogTitle>
                <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>{getActionSubtitle()}</p>
              </div>
            </div>
            {eansList.length > 0 && (
              <Badge variant='secondary' className='ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'>
                {eansList.length} scanned
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className='flex-1 min-h-0 overflow-y-auto'>
          {action ? (
            <div className='h-full flex flex-col space-y-6 p-6'>
              {/* Scanner Input */}
              <Card className='flex-shrink-0 border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm'>
                <div className='p-6'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center'>
                      <Scan className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                    </div>
                    <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Barcode Scanner</h3>
                    {isProcessing && (
                      <Badge variant='outline' className='border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300'>
                        Processing...
                      </Badge>
                    )}
                  </div>
                  <div className='relative'>
                    <PersistentFocusInput
                      value={inputValue}
                      onInputChange={(value) => {
                        setInputValue(value);
                        if (inputTimer.current) {
                          clearTimeout(inputTimer.current);
                        }
                        inputTimer.current = setTimeout(() => {
                          if (value && value.length > 0 && !isProcessing) {
                            setEansList((prev) => [...prev, value]);
                          }
                        }, 300);
                      }}
                      onKeyDown={handleKeyDown}
                      className='w-full h-12 pl-12 pr-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200'
                      placeholder='Scan barcode or enter EAN manually'
                      disabled={isProcessing}
                    />
                    <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                    {isProcessing && (
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                        <div className='w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin' />
                      </div>
                    )}
                  </div>

                  {/* Manual Add to Not Found Button */}
                  {inputValue && inputValue.length > 0 && !isProcessing && (
                    <div className='mt-3 flex items-center gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          handleAddToNotFound(inputValue);
                          setInputValue('');
                          toast.success(`Added ${inputValue} to not found list`);
                        }}
                        className='text-xs h-8 px-3 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-900/20'
                      >
                        <Plus className='h-3 w-3 mr-1' />
                        Add to Not Found
                      </Button>
                      <span className='text-xs text-slate-500 dark:text-slate-400'>If this EAN is not in your system, add it to the not found list</span>
                    </div>
                  )}
                  {/* {eansList.length > 0 && (
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {eansList.slice(-5).map((ean, index) => (
                        <Badge key={index} variant='outline' className='text-xs font-mono'>
                          {ean}
                        </Badge>
                      ))}
                      {eansList.length > 5 && (
                        <Badge variant='secondary' className='text-xs'>
                          +{eansList.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )} */}
                </div>
              </Card>

              {/* Content Area */}
              <div className='flex-1 min-h-0'>
                {action === 'stock' ? (
                  <StockCheck
                    notFoundEans={notFoundEans}
                    setNotFoundEans={setNotFoundEans}
                    handleSearchAll={handleSearchProducts}
                    isPending={isProcessing}
                    onSyncAll={handleSyncAll}
                    onSyncOne={() => {}}
                    products={products}
                    updateProductStock={updateProductStock}
                  />
                ) : (
                  <NewDelivery
                    handleSearchAll={handleSearchProducts}
                    isPending={isProcessing}
                    notFoundEans={notFoundEans}
                    onUpdateAll={handleUpdateAll}
                    onUpdateOne={() => {}}
                    products={products}
                    setNotFoundEans={setNotFoundEans}
                    updateProductStock={updateProductStock}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className='h-full flex flex-col space-y-8 p-6 overflow-y-auto'>
              {/* Global Sync Button */}
              <Card className='flex-shrink-0 border-0 shadow-sm bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20'>
                <div className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg'>
                        <Zap className='h-6 w-6 text-white' />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Sync All Products</h3>
                        <p className='text-sm text-slate-600 dark:text-slate-400'>Synchronize entire inventory with external systems</p>
                      </div>
                    </div>
                    <Button
                      // onClick={() =>
                      //   syncProductsBefore({
                      //     userId: userId!,
                      //     warehouseId: warehouseId!,
                      //   })
                      // }
                      // disabled={pendingSyncBefore}
                      className='bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6'
                    >
                      <Zap className='h-4 w-4 mr-2' />
                      Sync Now
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Action Selection */}
              <div className='flex-1 min-h-0'>
                <div className='mb-6'>
                  <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2'>Choose Operation</h3>
                  <p className='text-slate-600 dark:text-slate-400'>Select the type of scanning operation you want to perform</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[320px]'>
                  {/* Stock Check Card */}
                  <Card
                    onClick={() => setAction('stock')}
                    className='group cursor-pointer border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                  >
                    <div className='h-full p-8 flex flex-col items-center justify-center text-center space-y-6'>
                      <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-200'>
                        <ListChecks className='h-10 w-10 text-white' />
                      </div>
                      <div className='space-y-2'>
                        <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100'>Stock Check</h3>
                        <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                          Verify current inventory levels and sync quantities with your system
                        </p>
                      </div>
                      <div className='flex items-center text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200'>
                        <span className='text-sm font-medium'>Get Started</span>
                        <ArrowRight className='h-4 w-4 ml-2' />
                      </div>
                    </div>
                  </Card>

                  {/* New Delivery Card */}
                  <Card
                    onClick={() => setAction('order')}
                    className='group cursor-pointer border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20'
                  >
                    <div className='h-full p-8 flex flex-col items-center justify-center text-center space-y-6'>
                      <div className='w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-200'>
                        <PackageOpen className='h-10 w-10 text-white' />
                      </div>
                      <div className='space-y-2'>
                        <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100'>New Delivery</h3>
                        <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>Process incoming shipments and update inventory quantities</p>
                      </div>
                      <div className='flex items-center text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-200'>
                        <span className='text-sm font-medium'>Get Started</span>
                        <ArrowRight className='h-4 w-4 ml-2' />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScannerDialog;
