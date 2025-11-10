import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateIntegration } from '@/features/integrations/create-integration';
import { AppIntegration } from '@/lib/constants';
import { DialogProps } from '@/lib/types/common';
import { addDays } from 'date-fns';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props extends DialogProps {
  integration: AppIntegration;
}
const CreateIntegrationDialog: React.FC<Props> = ({ open, setOpen, integration }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [name, setName] = useState<string>('');
  const { mutate: create, isPending } = useCreateIntegration({
    opts: {
      queryKey: ['getUserIntegrations'],
      override_onSuccess: (data) => {
        setOpen(false);
        setApiKey('');
        toast.success(`Successfully integrated with: ${data.platform.toLowerCase()}`);
      },
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='sm:max-w-3xl w-full flex flex-col gap-6'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Integrate with {integration.name}</DialogTitle>
          <DialogDescription>
            Enter your API key to integrate with {integration.name}. This will allow us to connect your account and manage your {integration.platform} data.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col items-start gap-3'>
          <Input onChange={(e) => setName(e.target.value)} placeholder='Integration name...' />
          <Input onChange={(e) => setApiKey(e.target.value)} placeholder='API key...' />
          <Button
            onClick={() => {
              create({
                expiresAt: addDays(new Date(), 10000),
                name: name,
                platform: integration.platform,
                slug: name.toLowerCase().replaceAll(' ', '-'),
                apiKey,
              });
            }}
            disabled={isPending}
            className='flex items-center gap-3'
          >
            {isPending && <Loader2 className='animate-spin' />}
            Integrate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIntegrationDialog;
