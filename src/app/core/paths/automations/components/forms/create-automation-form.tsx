import TextAreaWithConstants from '@/app/core/components/textarea-with-constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateAutomationInput, createAutomationSchema, useCreateAutomation } from '@/features/automations/create-automation';
import { useUserIntegrations } from '@/features/user/get-user-integrations';
import { automationsActions, colorSchemes } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Puzzle, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const CreateAutomationForm = ({ close }: { close: () => void }) => {
  const form = useForm<CreateAutomationInput>({
    resolver: zodResolver(createAutomationSchema),
    defaultValues: {
      metadata: {},
    },
  });
  const { mutate: create, isPending } = useCreateAutomation({
    opts: {
      queryKey: ['getUserAutomations'],
      override_onSuccess: () => {
        toast.success(t('automations.form.success'));
        form.reset();
        close();
      },
      override_onError: () => {
        toast.error(t('automations.form.error'));
      },
    },
  });

  const { data: integrations } = useUserIntegrations({});
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const { t } = useTranslation();
  const onSubmit = (data: CreateAutomationInput) => {
    create(data);
  };
  const actionVal = useMemo(() => {
    const val = form.getValues('action');
    if (val) {
      const action = automationsActions.find((action) => action.action === val);
      const colorScheme = colorSchemes[action?.scheme as keyof typeof colorSchemes];

      return { action, colorScheme };
    }
  }, [form.watch('action')]);

  return (
    <Form {...form}>
      <form className='flex flex-col gap-6 w-full' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='action'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('automations.form.action.label')}</FormLabel>
              <Popover
                open={openPopover}
                onOpenChange={(v) => {
                  if (!v) {
                    setOpenPopover(v);
                  }
                }}
              >
                <PopoverTrigger onClick={() => setOpenPopover(true)}>
                  <div
                    className={`${
                      field?.value ? 'p-3' : 'border-dashed'
                    } cursor-pointer border border-border w-full min-h-9 rounded-md flex items-center gap-5`}
                  >
                    {field.value && actionVal && actionVal.action && (
                      <div className='w-full focus:bg-muted/40 cursor-pointer'>
                        <div className='flex items-center gap-3 w-full'>
                          {/* Icon container that matches your UI */}
                          <div className={`h-16 w-16 rounded-md flex items-center justify-center ${actionVal.colorScheme.bg} `}>
                            <actionVal.action.icon className={`${actionVal?.colorScheme?.textLight} h-5 w-5`} />
                          </div>

                          <div className='flex flex-col w-[calc(100%-5.25rem)]'>
                            <div className='flex items-center justify-between w-full'>
                              <p className='text-base font-semibold text-gray-100'>
                                {automationsActions.find((action) => action.action === field.value)?.name}
                              </p>
                              <div className='flex items-center gap-2'>
                                {automationsActions.find((action) => action.action === field.value)?.isBeta && (
                                  <div className='flex items-center bg-primary/10 gap-2 text-primary border border-primary/50 text-xs rounded-md px-2 py-1'>
                                    <Puzzle className='h-3 w-3 text-primary' />
                                    <span className=''>Beta</span>
                                  </div>
                                )}
                                {automationsActions.find((action) => action.action === field.value)?.isNew && (
                                  <div className='flex items-center bg-primary/10 gap-2 text-primary border border-primary/50 text-xs rounded-md px-2 py-1'>
                                    <Sparkles className='h-3 w-3 text-primary' />
                                    <span className=''>New</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className='text-xs text-muted-foreground mt-1 line-clamp-1'>{actionVal.action.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className='w-full gap-2 flex flex-col'>
                  {automationsActions.map((action) => {
                    const colorScheme = colorSchemes[action.scheme as keyof typeof colorSchemes];
                    return (
                      <div
                        key={action.id}
                        onClick={() => {
                          field.onChange(action.action);
                          setOpenPopover(false);
                        }}
                        className='w-full focus:bg-muted/40 cursor-pointer'
                      >
                        <div className='flex items-center gap-3 w-full'>
                          {/* Icon container that matches your UI */}
                          <div className={`h-16 w-16 rounded-md flex items-center justify-center ${colorScheme.bg} `}>
                            <action.icon className={`${colorScheme.textLight} h-5 w-5`} />
                          </div>

                          <div className='flex flex-col w-[calc(100%-5.25rem)]'>
                            <div className='flex items-center justify-between w-full'>
                              <p className='text-base font-semibold text-gray-100'>{action.name}</p>
                              <div className='flex items-center gap-2'>
                                {action.isBeta && (
                                  <div className='flex items-center bg-primary/10 gap-2 text-primary border border-primary/50 text-xs rounded-md px-2 py-1'>
                                    <Puzzle className='h-3 w-3 text-primary' />
                                    <span className=''>Beta</span>
                                  </div>
                                )}
                                {action.isNew && (
                                  <div className='flex items-center bg-primary/10 gap-2 text-primary border border-primary/50 text-xs rounded-md px-2 py-1'>
                                    <Sparkles className='h-3 w-3 text-primary' />
                                    <span className=''>New</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>{action.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </PopoverContent>
              </Popover>
              <FormDescription>{t('automations.form.action.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {actionVal?.action?.tags?.includes('messages') && (
          <FormField
            name='metadata.message'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <TextAreaWithConstants {...field} placeholder='Note: To use dynamic values use {{ buyer.name }}' />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Want to use dynamic text?{' '}
                  <Dialog>
                    <DialogTrigger>
                      <span className='text-primary cursor-pointer'> See constants reference</span>
                    </DialogTrigger>
                    <DialogContent></DialogContent>
                  </Dialog>
                </FormDescription>
              </FormItem>
            )}
          />
        )}
        {form.watch('action') && (
          <FormField
            name='integrationId'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('automations.form.integration.label')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t('automations.form.integration.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {integrations?.map((integration) => (
                      <SelectItem key={integration.id} value={integration.id}>
                        {integration.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{t('automations.form.integration.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button disabled={isPending} className='flex items-center gap-2' type='submit'>
          {isPending && <Loader2 className='animate-spin' />}
          {t('automations.form.submit')}
        </Button>
      </form>
    </Form>
  );
};

export default CreateAutomationForm;
