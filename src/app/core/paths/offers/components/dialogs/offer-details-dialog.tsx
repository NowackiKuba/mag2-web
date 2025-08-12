import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOffer } from '@/features/offers/get-offer-by-id';
import { DialogDetailsProps } from '@/lib/types/common';
import { ImageOff, Loader2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const OfferDetailsDialog = ({ open, setOpen, id }: DialogDetailsProps) => {
  const { data, isLoading } = useOffer({
    id,
    opts: {
      enabled: !!id && id !== '',
    },
  });
  const { t } = useTranslation();
  console.log(data);
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
          <p className='text-lg font-semibold'>Loading Offer</p>
        </DialogContent>
      ) : (
        <DialogContent className='sm:max-w-5xl w-full flex flex-col gap-6'>
          <DialogHeader className='flex flex-col items-start gap-1'>
            <DialogTitle className='text-2xl font-bold'>{t('offer.details.title')}</DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>{t('offer.details.description')}</DialogDescription>
          </DialogHeader>
          <div className='flex items-center gap-5 pb-3 border-b border-border w-full'>
            <Avatar className='h-28 w-28 rounded-lg'>
              <AvatarImage src={data?.primaryImage?.url} className='object-fit' />
              <AvatarFallback className='h-28 w-28 rounded-lg bg-secondary border border-border shadow-md flex items-center justify-center text-muted-foreground'>
                <ImageOff className='h-10 w-10' />
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col items-start justify-between pt-1.5 h-28'>
              <div className='flex flex-col items-start gap-0.5'>
                <p className='text-lg  font-semibold'>{data?.name}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default OfferDetailsDialog;
