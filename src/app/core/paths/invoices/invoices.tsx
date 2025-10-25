import { useInvoices } from '@/features/invoices/get-all-invoices';
import { IntegrationPlatform } from '@/lib/types/api';

import PageTitle from '../../components/atoms/page-title';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Invoices = () => {
  const { data } = useInvoices({
    provider: IntegrationPlatform.FAKTUROWO,
    opts: {},
  });

  // console.log(data); // Debug log removed
  const { t } = useTranslation();
  return (
    <div className='flex flex-col gap-8 w-full h-full'>
      <div className='flex items-center justify-between w-full'>
        <PageTitle icon={FileText} title={t('invoices.title')} label={t('invoices.description')} />
      </div>
      <div className='flex flex-col gap-4 w-full h-full'>
        <div className='bg-secondary shadow-md border border-border rounded-xl p-5 max-h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-left'>Number</TableHead>
                <TableHead>Net. Value</TableHead>
                <TableHead>VAT Value</TableHead>
                <TableHead>Gross Value</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Buyer NIP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.invoices.map((invoice) => (
                <TableRow key={invoice.docNumber}>
                  <TableCell className='text-left'>{invoice.docNumber}</TableCell>
                  <TableCell>{invoice.netValue}</TableCell>
                  <TableCell>{invoice.vatValue}</TableCell>
                  <TableCell>{invoice.grossValue}</TableCell>
                  <TableCell>{invoice.currency}</TableCell>
                  <TableCell>{invoice.buyerName}</TableCell>
                  <TableCell>{invoice?.buyerNip ? invoice.buyerNip : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
