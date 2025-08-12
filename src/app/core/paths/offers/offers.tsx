import { useUserOffers } from '@/features/user/get-user-offers';
import PageTitle from '../../components/atoms/page-title';
import { Tag } from 'lucide-react';
import LocalSearchbar from '@/components/local-searchbar';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/pagination';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import OfferDetailsDialog from './components/dialogs/offer-details-dialog';

const Offers = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams?.get('page') ? +searchParams.get('page')! : 1;
  const search = searchParams?.get('q') ? searchParams.get('q')! : '';
  const { data } = useUserOffers({
    queryProps: {
      page,
      pageSize: 8,
      search,
    },
  });

  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const { t } = useTranslation();
  return (
    <div className='flex flex-col items-start gap-6 w-full h-full'>
      <PageTitle icon={Tag} title={t('offers.title')} label={t('offers.description')} />
      <div className='flex items-center justify-between w-full'>
        <LocalSearchbar iconPosition='left' placeholder={t('offers.search')} className='max-w-[400px]' />
        <div className='flex items-center gap-3'></div>
      </div>
      <div className='w-full h-full p-5 bg-secondary border border-border flex rounded-xl'>
        <div className='flex flex-col items-start w-full justify-between h-full'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-left'></TableHead>
                <TableHead>{t('offers.name')}</TableHead>
                <TableHead>{t('offers.price')}</TableHead>
                <TableHead>{t('offers.status')}</TableHead>
                <TableHead>{t('offers.watchers')}</TableHead>
                <TableHead>{t('offers.visits')}</TableHead>
                <TableHead>{t('offers.stock')}</TableHead>
                <TableHead>{t('offers.soldUnits')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.offers.map((offer) => (
                <TableRow
                  onClick={() => {
                    setSelectedOfferId(offer.id);
                    setOpenDetails(true);
                  }}
                  className='cursor-pointer'
                  key={offer.id}
                >
                  <TableCell className='text-left'>
                    <img src={offer?.primaryImage.url ?? ''} className='h-10 w-10 rounded-md' />
                  </TableCell>
                  <TableCell className='max-w-[150px] truncate'>{offer?.name}</TableCell>
                  <TableCell>
                    {offer?.sellingMode?.price?.amount} {offer?.sellingMode?.price?.currency}
                  </TableCell>
                  <TableCell>{offer?.publication.status}</TableCell>
                  <TableCell>{offer?.stats?.watchersCount}</TableCell>
                  <TableCell>{offer?.stats?.visitsCount}</TableCell>
                  <TableCell>{offer.stock.available}</TableCell>
                  <TableCell>{offer.stock.sold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='flex items-center justify-end w-full'>
            <Pagination isNext={data?.count && data?.totalCount ? data?.count < data?.totalCount : false} page={page} />
          </div>
        </div>
      </div>
      <OfferDetailsDialog id={selectedOfferId} open={openDetails} setOpen={setOpenDetails} />
    </div>
  );
};

export default Offers;
