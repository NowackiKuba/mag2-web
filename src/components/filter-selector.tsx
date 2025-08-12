import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSearchParams } from 'react-router-dom';

interface Option {
  label: string;
  value: string | number | boolean;
}

interface Props {
  options: Option[];
  placeholder?: string;
  queryKey: string;
  className?: string;
  disabled?: boolean;
}

const FilterSelector: React.FC<Props> = ({ options, placeholder, queryKey, className, disabled = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<string | undefined>(searchParams.get(queryKey) ?? undefined);

  const handleFilter = (value: string | number | boolean) => {
    if (value === activeFilter) {
      setActiveFilter(undefined);
      searchParams.delete(queryKey);
    } else {
      setActiveFilter(value.toString());
      searchParams.set(queryKey, value.toString());
    }
    setSearchParams(searchParams);
  };
  return (
    <Select onValueChange={(e) => handleFilter(e)} value={activeFilter}>
      <SelectTrigger disabled={disabled} className={`${className} ${!className?.includes('w-') && 'w-[150px]'}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem onClick={(e) => e.preventDefault()} key={opt.label} value={opt.value.toString()}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelector;
