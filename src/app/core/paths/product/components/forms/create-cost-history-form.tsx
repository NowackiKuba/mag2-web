import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateCostHistoryInput, createCostHistorySchema, useCreateCostHistory } from '@/features/cost-history/create-cost-history';
import { currencies } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Props {
  close: () => void;
  ean: string;
}

const CreateCostHistoryForm = ({ close, ean }: Props) => {
  const form = useForm<CreateCostHistoryInput>({
    resolver: zodResolver(createCostHistorySchema),
    defaultValues: {
      ean,
      purchasedAt: new Date(),
    },
  });
  const { t } = useTranslation();
  const { mutate: create, isPending } = useCreateCostHistory({
    opts: {
      override_onSuccess: () => {
        toast.success('Successfully created cost history');
        close();
        form.reset();
      },
      queryKey: ['getProductById'],
    },
  });

  const onSubmit = (data: CreateCostHistoryInput) => {
    create(data);
  };
  return (
    <Form {...form}>
      <form className='flex flex-col gap-6 w-full' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='ean'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('costHistory.form.ean.label')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('costHistory.form.ean.placeholder')} />
              </FormControl>
              <FormMessage errorMessage={t('costHistory.form.ean.error')} />
            </FormItem>
          )}
        />
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('costHistory.form.name.label')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('costHistory.form.name.placeholder')} />
              </FormControl>
              <FormMessage errorMessage={t('costHistory.form.name.error')} />
              <FormDescription>{t('costHistory.form.name.description')}</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          name='quantity'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('costHistory.form.quantity.label')}</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  defaultValue={field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  placeholder={t('costHistory.form.quantity.placeholder')}
                />
              </FormControl>
              <FormMessage errorMessage={t('costHistory.form.quantity.error')} />
            </FormItem>
          )}
        />
        <div className='flex items-center gap-4 w-full'>
          <FormField
            name='unitCost'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>{t('costHistory.form.unitCost.label')}</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    defaultValue={field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    placeholder={t('costHistory.form.unitCost.placeholder')}
                  />
                </FormControl>
                <FormMessage errorMessage={t('costHistory.form.unitCost.error')} />
              </FormItem>
            )}
          />
          <FormField
            name='unitPrice'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>{t('costHistory.form.unitPrice.label')}</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    defaultValue={field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    placeholder={t('costHistory.form.unitPrice.placeholder')}
                  />
                </FormControl>
                <FormMessage errorMessage={t('costHistory.form.unitPrice.error')} />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name='currency'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('costHistory.form.currency.label')}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('costHistory.form.currency.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.code}>
                      {currency.flag} {t(currency.translationTag)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage errorMessage={t('costHistory.form.currency.error')} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='purchasedAt'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('costHistory.form.purchasedAt.label')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                      {field.value ? format(field.value, 'PPP') : <span>{t('costHistory.form.purchasedAt.placeholder')}</span>}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date('1900-01-01')} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage errorMessage={t('costHistory.form.purchasedAt.placeholder')} />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending} className='flex items-center gap-2'>
          {isPending && <Loader2 className='animate-spin' />}
          Add to History
        </Button>
      </form>
    </Form>
  );
};

export default CreateCostHistoryForm;
