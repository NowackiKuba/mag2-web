import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogProps } from '@/lib/types/common';
import CreateCostHistoryForm from '../forms/create-cost-history-form';

interface Props extends DialogProps {
  ean: string;
}

const CreateCostHistoryDialog = ({ open, setOpen, ean }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-6 w-full sm:max-w-2xl'>
        <CreateCostHistoryForm ean={ean} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCostHistoryDialog;
