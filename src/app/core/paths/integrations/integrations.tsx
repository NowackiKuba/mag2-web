import PageTitle from '../../components/atoms/page-title';
import { GitBranch, Plug } from 'lucide-react';
import { AppIntegration, appIntegrations } from '@/lib/constants';
import IntegrationCard from './components/cards/integration-card';
import { Button } from '@/components/ui/button';
import { useUserIntegrations } from '@/features/user/get-user-integrations';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import CreateIntegrationDialog from './components/dialogs/create-integration-dialog';

const Integrations = () => {
  const { data: userIntegrations } = useUserIntegrations({});
  const [isOpenCreateIntegration, setIsOpenCreateIntegration] = useState<boolean>(false);
  const [integration, setIntegration] = useState<AppIntegration>();
  return (
    <div className='flex flex-col gap-6 w-full'>
      <div className='flex items-center justify-between w-full'>
        <PageTitle icon={GitBranch} title='Integrations' label='Connect and manage your integrations' />
        {/* <div className='flex items-center flex-wrap gap-3 w-full'>
        {appIntegrations.map((integration) => (
          <IntegrationCard integration={integration} key={integration.id} />
        ))}
      </div> */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className='flex items-center gap-2'>
              <Plug />
              Integrate
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {appIntegrations.map((integration) => (
              <DropdownMenuItem
                onClick={() => {
                  if (integration.type === 'api_key') {
                    setIntegration(integration);
                    setIsOpenCreateIntegration(true);
                  } else if (integration.type === 'link' && integration.link) {
                    window.open(integration.link, '_blank');
                  }
                }}
              >
                {integration.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='grid grid-cols-3 w-full gap-4'>
        {userIntegrations?.map((integration) => (
          <IntegrationCard integration={integration} key={integration.id} />
        ))}
      </div>
      {integration && <CreateIntegrationDialog integration={integration} open={isOpenCreateIntegration} setOpen={setIsOpenCreateIntegration} />}
    </div>
  );
};

export default Integrations;
