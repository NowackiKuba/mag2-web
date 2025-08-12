import { useTranslation } from 'react-i18next';
import PageTitle from '../../components/atoms/page-title';
import { ChevronDown, Plus, SquareFunction, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import CreateAutomationDialog from './components/dialogs/create-automation-dialog';
import { useUserAutomations } from '@/features/user/get-user-automations';
import { Switch } from '@/components/ui/switch';
import { useUpdateAutomation } from '@/features/automations/update-automation';
import { toast } from 'sonner';
import { automationsActions, colorSchemes } from '@/lib/constants';

const Automations = () => {
  const { t } = useTranslation();
  const [openDetails, setOpenDetails] = useState<boolean>(false);

  const { data } = useUserAutomations({});
  const { mutate: update } = useUpdateAutomation({
    opts: {
      queryKey: ['getUserAutomations'],
      override_onSuccess: () => {
        toast.success('Successfully updated automation');
      },
    },
  });
  return (
    <div className='flex flex-col gap-8 w-full h-full'>
      <div className='flex items-center justify-between w-full'>
        <PageTitle icon={SquareFunction} title={t('automations.title')} label={t('automations.description')} />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className='flex items-center gap-4'>
              {t('automations.manage')}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='min-w-[220px]'>
            <DropdownMenuItem onClick={() => setOpenDetails(true)} className='flex items-center gap-3 cursor-pointer w-full'>
              <Plus className='size-5 text-primary' />
              {t('automations.create')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {data && data?.length > 0 ? (
        <div className='flex items-center flex-wrap w-full gap-6'>
          {data?.map((automation) => {
            const { scheme: s, icon: Icon } = automationsActions.find((a) => automation.action === a.action)!;
            const scheme = colorSchemes[s as keyof typeof colorSchemes];
            return (
              <div className='w-[calc(50%-18px)]  flex p-5 bg-secondary border border-border rounded-xl shadow-md flex-col gap-2' key={automation.id}>
                <div className='flex items-center justify-between w-full pb-3 border-b border-border'>
                  <div className='flex items-center gap-5'>
                    <div className={`${scheme.bg} ${scheme.textLight} h-20 w-20 rounded-md border border-border flex items-center justify-center`}>
                      <Icon className='h-8 w-8' />
                    </div>
                    <div className='flex flex-col items-start gap-1'>
                      <p className='text-xl font-semibold first-letter:uppercase'>{automation.action.replaceAll('_', ' ').toLowerCase()}</p>
                      {automation.isActive ? (
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 rounded-full bg-green-500' />
                          <p className='font-[500] text-muted-foreground'>Active</p>
                        </div>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 rounded-full bg-red-500' />
                          <p className='font-[500] text-muted-foreground'>Inactive</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-between w-full'>
                  <div
                    className={`px-3 py-1.5 rounded-md flex items-center text-sm font-semibold gap-2 ${
                      automation.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {automation.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <Switch
                    onCheckedChange={() => {
                      update({
                        id: automation.id,
                        isActive: automation.isActive ? false : true,
                      });
                    }}
                    className={automation.isActive ? 'bg-green-500' : 'bg-red-500'}
                    checked={automation.isActive ? true : false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='w-full flex flex-col h-full items-center justify-center gap-6'>
          <StarOff className='size-24 text-primary' />
          <div className='text-center'>
            <p className='text-xl font-bold'>No automations to show</p>
            <p className='text-base text-muted-foreground'>All created automations will show up here</p>
          </div>
        </div>
      )}
      <CreateAutomationDialog open={openDetails} setOpen={setOpenDetails} />
    </div>
  );
};

export default Automations;
