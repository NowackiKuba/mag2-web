import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Integration } from '@/lib/types/api';
import { MoreVertical } from 'lucide-react';

const IntegrationCard = ({ integration, className }: { integration: Integration; className?: string }) => {
  return (
    <div className={`${className} w-full p-5 rounded-xl bg-secondary shadow-md border border-border flex group hover:shadow-xl transition-all duration-300`}>
      {/* Left Side - Icon */}
      <div className={`size-16 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mr-4`}>
        <span className='text-white text-lg font-bold'>{integration.name.charAt(0)}</span>
      </div>

      <div className='flex flex-col items-start gap-1 w-full'>
        <div className='flex items-center justify-between w-full'>
          <p className='text-lg font-bold'>{integration?.name}</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={'ghost'} size={'icon'}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
        <div className='p-2 dark:bg-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-200 capitalize text-xs font-semibold rounded-lg'>
          {integration?.platform?.toLowerCase()}
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
