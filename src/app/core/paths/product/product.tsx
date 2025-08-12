import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProduct } from '@/features/products/get-by-id';
import { AlertOctagon, Barcode, ImageOff, Plus } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CreateCostHistoryDialog from './components/dialogs/create-cost-history-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const Product = () => {
  const { id } = useParams();
  const { data, isLoading } = useProduct({
    id: id!,
    opts: {
      enabled: !!id && id !== '',
    },
  });
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  console.log(data);
  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-start h-full w-full'>
        <div className='w-full flex flex-col items-center justify-center gap-8 max-w-[1200px] h-full pt-12'>
          <Skeleton className='h-36 w-full rounded-xl' />
          <div className='flex items-start gap-8 h-full w-full'>
            <Skeleton className='w-3/5 rounded-xl h-full' />
            <Skeleton className='w-2/5 rounded-xl h-44' />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='flex flex-col items-center justify-start w-full'>
      <div className='w-full flex flex-col items-center justify-center gap-8 max-w-[1200px] h-full pt-12'>
        <div className='flex items-center gap-5 w-full pb-3 border-b border-border'>
          <Avatar className='h-32 w-32 rounded-lg'>
            <AvatarImage src={data?.primaryImageUrl} />
            <AvatarFallback className='h-full w-full bg-secondary border-border border text-muted-foreground rounded-lg'>
              <ImageOff className='h-10 w-10' />
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-start gap-2'>
            <p className='text-2xl font-bold max-w-[95%] line-clamp-1'>{data?.name}</p>
            <div className='flex items-center gap-3 w-full'>
              <div className='flex items-center gap-2'>
                <Barcode className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>{data?.ean}</p>
              </div>
              <p className='text-xl font-bold text-muted-foreground'>&middot;</p>
            </div>
          </div>
        </div>
        <div className='flex gap-8 w-full items-start '>
          <div className='w-3/5 flex flex-col gap-4 bg-secondary rounded-xl border border-border p-5'>
            <h2 className='text-xl font-bold'>Product Details</h2>

            {/* Basic Info */}
            <div className='flex flex-col gap-1'>
              <p className='text-sm text-muted-foreground'>Name</p>
              <p className='font-medium'>{data?.name}</p>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm text-muted-foreground'>EAN</p>
              <p className='font-medium'>{data?.ean}</p>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm text-muted-foreground'>Stock</p>
              <p className='font-medium'>{data?.stock}</p>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm text-muted-foreground'>Category</p>
              <p className='font-medium'>{data?.category ?? '—'}</p>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm text-muted-foreground'>Created at</p>
              {data && <p className='font-medium'>{format(new Date(data?.createdAt ?? ''), 'dd.MM.yyyy')}</p>}
            </div>

            {/* Allegro Offer Info */}
            {data?.details && (
              <>
                <h3 className='text-lg font-semibold pt-4'>{data?.source} Offer</h3>

                <div className='flex flex-col gap-1'>
                  <p className='text-sm text-muted-foreground'>Language</p>
                  <p className='font-medium'>"NO DATA</p>
                </div>

                <div className='flex flex-col gap-1'>
                  <p className='text-sm text-muted-foreground'>Publication Status</p>
                  <p className='font-medium'>{data?.details?.publication?.status}</p>
                </div>
                {data && (
                  <>
                    <div className='flex flex-col gap-1'>
                      <p className='text-sm text-muted-foreground'>Starts At</p>
                      <p className='font-medium'>{format(new Date(data.details.publication?.startingAt ?? new Date()), 'dd.MM.yyyy HH:mm')}</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                      <p className='text-sm text-muted-foreground'>Ends At</p>
                      <p className='font-medium'>{format(new Date(data.details.publication?.endingAt ?? new Date()), 'dd.MM.yyyy HH:mm')}</p>
                    </div>
                  </>
                )}

                <div className='flex flex-col gap-1'>
                  <p className='text-sm text-muted-foreground'>Republish</p>
                  {/* <p className='font-medium'>{data.details. ? 'Yes' : 'No'}</p> */}
                </div>

                {/* Optional: product sets (if available) */}
                {/* {data.details.pr?.length > 0 && (
                  <div className='flex flex-col gap-1 pt-4'>
                    <p className='text-sm text-muted-foreground'>Product Set Quantity</p>
                    <p className='font-medium'>{data.details.productSet[0].quantity.value}</p>
                  </div>
                )} */}
              </>
            )}
          </div>

          <div className='flex flex-col h-full items-start gap-3 w-2/5 bg-secondary rounded-xl p-3 border border-border'>
            <div className='flex items-center justify-between w-full'>
              <p className='text-xl font-bold'>Cost History</p>
              <Button
                onClick={() => {
                  setOpenCreate(true);
                }}
                size={'icon'}
                variant={'ghost'}
              >
                <Plus />
              </Button>
            </div>
            {data?.costHistory && data?.costHistory?.length > 0 ? (
              <Table>
                <TableHeader className='bg-muted'>
                  <TableRow>
                    <TableHead className='text-left rounded-tl-xl'>Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className='text-right rounded-tr-xl'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.costHistory?.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell className='text-left'>{format(cost.purchasedAt, 'dd.MM.yy')}</TableCell>
                      <TableCell>{cost.quantity}</TableCell>
                      <TableCell>
                        {cost.unitCost} {cost.currency}
                      </TableCell>
                      <TableCell className='text-right'>
                        {cost.unitPrice} {cost.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className='mt-10 pb-10 flex flex-col items-center justify-center gap-2 w-full'>
                <AlertOctagon className='h-12 w-12 text-red-200' />
                <div className='flex flex-col items-center justify-center'>
                  <p className='text-lg font-semibold'>We've got a problem</p>
                  <p className='text-sm text-muted-foreground'>This product doesn't have any cost histories</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateCostHistoryDialog ean={data?.ean ?? ''} open={openCreate} setOpen={setOpenCreate} />
    </div>
  );
};

export default Product;
