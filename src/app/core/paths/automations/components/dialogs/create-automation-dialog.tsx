import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogProps } from '@/lib/types/common';
import { useTranslation } from 'react-i18next';
import CreateAutomationForm from '../forms/create-automation-form';

const CreateAutomationDialog = ({ open, setOpen }: DialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-6 w-full sm:max-w-3xl'>
        <DialogHeader className='flex flex-col items-start'>
          <DialogTitle className='text-2xl font-bold'>{t('automations.form.title')}</DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>{t('automations.form.description')}</DialogDescription>
        </DialogHeader>
        <CreateAutomationForm close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAutomationDialog;
