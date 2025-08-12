import PageTitle from '../../components/atoms/page-title';
import { GitBranch } from 'lucide-react';
import { appIntegrations } from '@/lib/constants';
import IntegrationCard from './components/cards/integration-card';

const Integrations = () => {
  return (
    <div className='flex flex-col gap-6 w-full'>
      <PageTitle icon={GitBranch} title='Integrations' label='Connect and manage your integrations' />
      <div className='flex items-center flex-wrap gap-3 w-full'>
        {appIntegrations.map((integration) => (
          <IntegrationCard integration={integration} key={integration.id} />
        ))}
      </div>
    </div>
  );
};

export default Integrations;
