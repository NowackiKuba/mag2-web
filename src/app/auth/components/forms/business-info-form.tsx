import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateBusinessDataInput, createBusinessDataSchema, useCreateBusinessData } from '@/features/business-data/create-business-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const BusinessInfoForm = () => {
  const form = useForm<CreateBusinessDataInput>({
    resolver: zodResolver(createBusinessDataSchema),
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutate: save, isPending } = useCreateBusinessData({
    opts: {
      override_onSuccess: () => {
        navigate('/app/dashboard');
        toast.success(t('auth.form.business.success'));
        form.reset();
      },
      override_onError: () => {
        toast.error(t('auth.form.business.error'));
      },
    },
  });

  const onSubmit = (data: CreateBusinessDataInput) => {
    save(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
        <FormField
          name='companyName'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>{t('auth.form.business.companyName')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='country'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.form.business.country')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='state'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center justify-between w-full'>
                <FormLabel>{t('auth.form.business.state')}</FormLabel>
                <FormLabel className='text-muted-foreground'>{t('optional')}</FormLabel>
              </div>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-center gap-4 w-full'>
          <FormField
            name='city'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>{t('auth.form.business.city')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='postalCode'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-[220px]'>
                <FormLabel>{t('auth.form.business.postalCode')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex items-center gap-4 w-full'>
          <FormField
            name='street'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>{t('auth.form.business.street')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='houseNumber'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-[220px]'>
                <FormLabel>{t('auth.form.business.houseNumber')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name='nipNumber'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.form.business.nipNumber.label')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t('auth.form.business.nipNumber.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending && <Loader2 className='animate-spin' />}
          {t('auth.form.business.submit')}
        </Button>
      </form>
    </Form>
  );
};

export default BusinessInfoForm;
