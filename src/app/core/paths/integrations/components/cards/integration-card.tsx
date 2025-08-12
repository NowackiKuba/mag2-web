import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateIntegration } from '@/features/integrations/create-integration';
import { useUserIntegrations } from '@/features/user/get-user-integrations';
import { AppIntegration, colorSchemes } from '@/lib/constants';
import { addDays } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const IntegrationCard = ({ integration, className }: { integration: AppIntegration; className?: string }) => {
  const scheme = colorSchemes[integration.scheme as keyof typeof colorSchemes];

  const { data: userIntegrations } = useUserIntegrations({});
  const disabled = useMemo(() => {
    return !!userIntegrations?.find((userIntegration) => userIntegration.platform === integration.platform);
  }, []);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const { mutate: create, isPending } = useCreateIntegration({
    opts: {
      queryKey: ['getUserIntegrations'],
      override_onSuccess: (data) => {
        setOpenCreate(false);
        setApiKey('');
        toast.success(`Successfully integrated with: ${data.platform.toLowerCase()}`);
      },
    },
  });
  return (
    <div
      className={`${className} w-[calc(50%-9px)] p-5 rounded-xl bg-secondary shadow-md border border-border flex group hover:shadow-xl transition-all duration-300`}
    >
      {/* Left Side - Icon */}
      <div className={`h-12 w-12 rounded-lg ${scheme.bg} flex items-center justify-center flex-shrink-0 mr-4`}>
        <span className='text-white text-lg font-bold'>{integration.name.charAt(0)}</span>
      </div>

      {/* Right Side - Content */}
      <div className='flex flex-col flex-grow'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-semibold text-lg'>{integration.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${scheme.bgLight} ${scheme.text} font-medium`}>
            {integration.type === 'api_key' ? 'API Key' : 'Link'}
          </span>
        </div>

        <p className='text-sm text-gray-600 mb-3'>{integration.description}</p>

        <div className='mt-auto flex justify-between items-center'>
          <span className='text-xs text-gray-500'>Platform: {integration.platform}</span>
          {integration.type === 'api_key' ? (
            <Dialog
              open={openCreate}
              onOpenChange={(v) => {
                if (!v) {
                  setOpenCreate(v);
                }
              }}
            >
              <DialogTrigger>
                <Button onClick={() => setOpenCreate(true)} disabled={disabled || isPending}>
                  {userIntegrations?.find((userIntegration) => userIntegration.platform === integration.platform) ? 'Linked' : 'Link'}
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-3xl w-full flex flex-col gap-6'>
                <DialogHeader>
                  <DialogTitle className='text-2xl font-bold'>Integrate with {integration.name}</DialogTitle>
                  <DialogDescription>
                    Enter your API key to integrate with {integration.name}. This will allow us to connect your account and manage your {integration.platform}{' '}
                    data.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col items-start gap-3'>
                  <Input onChange={(e) => setApiKey(e.target.value)} placeholder='API key...' />
                  <Button
                    onClick={() => {
                      create({
                        expiresAt: addDays(new Date(), 10000),
                        name: integration.name,
                        platform: integration.platform,
                        slug: integration.name.toLowerCase().replaceAll(' ', '-'),
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
          ) : (
            <Link
              to={integration.link ?? ''}
              target='_blank'
              className={buttonVariants({
                className: 'bg-orange-500 hover:bg-orange-500/90 text-white',
                variant: 'default',
              })}
              onClick={(e) => {
                if (userIntegrations?.find((userIntegration) => userIntegration.platform === integration.platform)) {
                  e.preventDefault();
                }
              }}
              style={{
                pointerEvents: userIntegrations?.find((userIntegration) => userIntegration.platform === integration.platform) ? 'none' : 'auto',
                opacity: userIntegrations?.find((userIntegration) => userIntegration.platform === integration.platform) ? 0.5 : 1,
              }}
            >
              {userIntegrations?.find((userIntegration) => userIntegration.platform === integration.platform) ? 'Connected' : 'Connect'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
