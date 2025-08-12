import { Search } from 'lucide-react';
import React, { useRef } from 'react';
import { Input } from './ui/input';
import { useSearchParams } from 'react-router-dom';

interface Props {
  placeholder?: string;
  className?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
}

const LocalSearchbar: React.FC<Props> = ({ placeholder, className, iconPosition = 'left', disabled = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = React.useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Input change handler - just updates local state
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Effect that handles the debounced URL update
  React.useEffect(() => {
    // Clear previous timeout on each search value change
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);

      if (!searchValue.trim()) {
        newParams.delete('q');
      } else {
        newParams.set('q', searchValue.trim());
      }

      setSearchParams(newParams);
    }, 300);

    // Cleanup on unmount or before next effect run
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue, searchParams, setSearchParams]);
  return (
    <div className={`${className} ${disabled && 'opacity-50'} border border-border h-9 w-full rounded-xl bg-input/30 flex items-center gap-2 px-4`}>
      {iconPosition === 'left' && <Search className='h-5 w-5 text-muted-foreground' />}
      <Input
        disabled={disabled}
        onChange={handleSearchInput}
        placeholder={placeholder}
        className='bg-transparent dark:bg-transparent w-full focus-visible:ring-0 focus-visible:ring-offset-0 border-none outline-none'
      />
      {iconPosition === 'right' && <Search className='h-5 w-5 text-muted-foreground' />}
    </div>
  );
};

export default LocalSearchbar;
