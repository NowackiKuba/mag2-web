import { CreateIntegrationInput, useCreateIntegration } from '@/features/integrations/create-integration';
import { IntegrationPlatform } from '@/lib/types/api';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const IntegrationMiddleware = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get('code');

  const { mutateAsync: integrate } = useCreateIntegration({
    opts: {
      override_onSuccess: () => {
        navigate(`/app/integrations`);
      },
    },
  });
  useEffect(() => {
    if (!code) {
      return;
    }

    const handleCreateIntegration = async () => {
      try {
        const payload: CreateIntegrationInput = {
          code,
          expiresAt: new Date(),
          name: 'Allegro',
          platform: IntegrationPlatform.ALLEGRO,
          slug: 'allegro',
        };
        await integrate(payload);
      } catch (error) {
        console.log(error);
        return;
      }
    };

    handleCreateIntegration();
  }, [code, navigate]);
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center gap-5'>
      <Loader2 className='h-44 w-44 text-primary animate-spin' />
      <div className='flex flex-col items-center justify-center gap-1'>
        <p className='text-2xl font-bold'>Wait a minute</p>
        <p className='text-sm text-muted-foreground'>Don't close this page. We are finishing your integration</p>
      </div>
    </div>
  );
};

export default IntegrationMiddleware;
