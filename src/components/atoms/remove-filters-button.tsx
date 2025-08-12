import { LucideIcon, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParams } from 'react-router-dom';

const RemoveFiltersButton = ({ keys, className, text, icon: IconComponent }: { keys: string[]; className?: string; text: string; icon?: LucideIcon }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Button
      onClick={() => {
        for (const key of keys) {
          searchParams.delete(key);
        }
        setSearchParams(searchParams);
      }}
      variant={'destructive'}
      className={`${className}`}
    >
      {IconComponent ? <IconComponent /> : <Trash2 />}
      {text}
    </Button>
  );
};

export default RemoveFiltersButton;
