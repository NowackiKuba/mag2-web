import PageTitle from '../../components/atoms/page-title';
import { ChevronDown, ImageOff, Loader2, ScanBarcode, ShoppingBasket, Tag, Truck } from 'lucide-react';
import LocalSearchbar from '@/components/local-searchbar';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useUserProducts } from '@/features/user/get-user-products';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSaveProductsFromMarketplace } from '@/features/products/save-from-marketplace';
import { toast } from 'sonner';
import { IntegrationPlatform, ProductSource } from '@/lib/types/api';
import Pagination from '@/components/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ScannerDialog from '../../components/scanner/scanner-dialog';
import FilterSelector from '@/components/filter-selector';
import RemoveFiltersButton from '@/components/atoms/remove-filters-button';

const Products = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams?.get('page') ? +searchParams.get('page')! : 1;
  const search = searchParams?.get('q') ? searchParams.get('q')! : '';
  const source = searchParams?.get('source') ? searchParams.get('source')! : undefined;
  const { data } = useUserProducts({
    queryOptions: {
      page,
      pageSize: 30,
      search,
      source: source as ProductSource,
    },
  });

  const [openScanner, setOpenScanner] = useState<boolean>(false);
  const { mutate: saveFromMarketplace, isPending } = useSaveProductsFromMarketplace({
    opts: {
      override_onSuccess: () => {
        toast.success('Successfully synced products from marketplace', { duration: 1500 });
      },
      onSettled: () => {
        toast.dismiss('info-processing-toast');
        setOpenDropdown(false);
      },
      onMutate: () => {
        toast.info('Started processing products', {
          description: 'It can take a while',
          id: 'info-processing-toast',
          dismissible: false,
          duration: 9999999,
          className: 'flex items-center gap-5',
          icon: <Loader2 className='animate-spin' />,
        });
      },
    },
  });

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-start gap-6 w-full h-full'>
      <div className='flex items-end justify-between w-full'>
        <PageTitle icon={Tag} title={t('products.title')} label={t('products.description')} />
        <DropdownMenu
          open={openDropdown}
          onOpenChange={(v) => {
            if (!v) {
              setOpenDropdown(v);
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button onClick={() => setOpenDropdown(true)} className='flex items-center gap-2'>
              More Options
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-[270px]'>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='flex items-center gap-3'>
                <ShoppingBasket className='text-muted-foreground size-5' />
                Save From Marketplace
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  disabled={isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    saveFromMarketplace({
                      platform: IntegrationPlatform.ALLEGRO,
                    });
                    setOpenDropdown(false);
                  }}
                  className='cursor-pointer flex items-center gap-2'
                >
                  <div className='h-3.5 w-3.5 rounded-full bg-orange-500' />
                  Allegro
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => setOpenScanner(true)} className='flex items-center gap-3 cursor-pointer'>
              <ScanBarcode className='size-5' />
              Run Stock Checker
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenScanner(true)} className='flex items-center gap-3 cursor-pointer'>
              <Truck className='size-5' />
              Scan New Delivery
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex items-center justify-between w-full'>
        <LocalSearchbar iconPosition='left' placeholder={t('products.search')} className='max-w-[400px]' />
        <div className='flex items-center gap-3'>
          {source && <RemoveFiltersButton keys={['source']} text='Remove Filters' />}
          <FilterSelector
            options={Object.values(ProductSource).map((source) => ({
              label: source[0] + source.substring(1, source.length).toLowerCase(),
              value: source,
            }))}
            queryKey='source'
            className='w-[220px]'
            placeholder='Filter by source'
          />
        </div>
      </div>
      <div className='w-full h-full p-5 bg-secondary border scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted border-border flex flex-col gap-10 rounded-xl overflow-y-auto'>
        <div className='flex flex-col items-center justify-center'>
          {data?.products?.map((product) => (
            <div
              key={product.id}
              className='w-full py-6 last:border-b-0 border-b border-border flex items-center gap-6 hover:bg-accent/50 transition-colors rounded-lg px-4'
            >
              <div className='flex items-center gap-2 flex-shrink-0'>
                <Avatar className='h-20 w-20 rounded-lg shadow-sm'>
                  <AvatarImage className='h-full w-full object-cover' src={product?.primaryImageUrl} alt={product?.name} />
                  <AvatarFallback className='h-full w-full bg-secondary border border-border rounded-lg text-muted-foreground flex items-center justify-center'>
                    <ImageOff className='text-muted-foreground h-8 w-8' />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className='flex flex-col items-start justify-between h-20 flex-1 min-w-0'>
                <div className='w-full'>
                  <h3
                    onClick={() => navigate(`./${product.id}`)}
                    className='text-lg hover:text-primary cursor-pointer font-semibold text-foreground line-clamp-2 leading-tight mb-1'
                  >
                    {product?.name}
                  </h3>
                </div>

                <div className='flex items-center gap-3 text-sm text-muted-foreground flex-wrap'>
                  <div className='flex items-center gap-1'>
                    <span className='font-medium'>ID:</span>
                    <span className='font-mono'>{product?.externalAllegroId ?? product?.externalErliId}</span>
                  </div>

                  <div className='text-muted-foreground/60'>&middot;</div>

                  <div className='flex items-center gap-1'>
                    <span className='font-medium'>EAN:</span>
                    <span className='font-mono'>{product?.ean}</span>
                  </div>

                  <div className='text-muted-foreground/60'>&middot;</div>

                  <div className='flex items-center gap-1'>
                    <span className='font-medium'>Źródło:</span>
                    <span className='capitalize bg-secondary/50 px-2 py-0.5 rounded text-xs font-medium'>{product?.source?.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-end gap-2 flex-shrink-0'>
                <div className='text-right'>
                  <p className='text-sm text-muted-foreground'>Stan magazynowy</p>
                  <p className={`text-lg font-bold ${product?.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {product?.stock}
                  </p>
                </div>

                <div className='text-xs text-muted-foreground text-right'>
                  <p>Utworzono: {new Date(product?.createdAt).toLocaleDateString('pl-PL')}</p>
                  <p>Zaktualizowano: {new Date(product?.updatedAt).toLocaleDateString('pl-PL')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='flex w-full justify-end'>
          <Pagination isNext={data?.count && data?.totalCount ? data?.count < data?.totalCount : false} page={page} />
        </div>

        {/* <div className='flex flex-col items-start w-full justify-between h-full'>
          <div className='flex flex-col gap-4 items-start w-full'>
            <p className='text-xl font-bold'>
              Showing {data?.count} of {data?.totalCount} products
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-left'>{t('products.image')}</TableHead>
                  <TableHead>{t('products.name')}</TableHead>
                  <TableHead>EAN</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>{t('products.stock')}</TableHead>
                  <TableHead>{t('products.lastCost')}</TableHead>
                  <TableHead>{t('products.lastPrice')}</TableHead>
                  <TableHead>{t('products.avgCost')}</TableHead>
                  <TableHead>{t('products.avgPrice')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.products?.map((product) => {
                  const avgCost = product.costHistory.reduce((acc, curr) => acc + curr.unitCost, 0) / product.costHistory.length;
                  const avgPrice = product.costHistory.reduce((acc, curr) => acc + curr.unitPrice, 0) / product.costHistory.length;
                  const currency = product?.costHistory?.[0]?.currency;
                  return (
                    <TableRow
                      onClick={() => {
                        navigate(`./${product.id}`);
                      }}
                      className='cursor-pointer'
                      key={product.id}
                    >
                      <TableCell className='w-14'>
                        <Avatar className='h-12 w-12 rounded-md'>
                          <AvatarImage className='h-full w-full' src={product?.primaryImageUrl} />
                          <AvatarFallback className='h-full w-full bg-secondary border border-border rounded-md text-muted-foreground flex items-center justify-center'>
                            <ImageOff className='text-muted-foreground' />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className='max-w-[150px] truncate text-left'>{product?.name}</TableCell>
                      <TableCell>{product?.ean}</TableCell>
                      <TableCell>
                        <p className={`${colorSchemes[MARKETPLACES[product.source].scheme].text}`}>{MARKETPLACES[product.source].title}</p>
                      </TableCell>
                      <TableCell>{product?.stock}</TableCell>
                      <TableCell>
                        {product?.costHistory?.[0]?.unitCost ?? 'No Data'} {currency}
                      </TableCell>
                      <TableCell>
                        {product?.costHistory?.[0]?.unitPrice ?? 'No Data'} {currency}
                      </TableCell>
                      <TableCell>
                        {isNaN(avgCost) ? 'No Data' : avgCost} {currency}
                      </TableCell>
                      <TableCell>
                        {isNaN(avgPrice) ? 'No Data' : avgPrice} {currency}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div> */}
        {/* <div className='flex items-center justify-end w-full'>
            <Pagination isNext={data?.count && data?.totalCount ? data?.count < data?.totalCount : false} page={page} />
          </div> */}
        {/* </div> */}
      </div>
      <ScannerDialog open={openScanner} setOpen={setOpenScanner} />
    </div>
  );
};

export default Products;
