import { Input } from '@/components/ui/input';
import React, { useEffect, useRef } from 'react';

interface PersistentFocusInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onInputChange: (value: string) => void;
}

const PersistentFocusInput: React.FC<PersistentFocusInputProps> = ({ onInputChange, value, className, placeholder, disabled, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Set initial focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Maintain focus whenever it might be lost
  useEffect(() => {
    const handleFocusOut = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Continuously check focus status
    const intervalId = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 200);

    // Add global click handler to redirect focus back to input
    document.addEventListener('click', handleFocusOut);
    document.addEventListener('focusin', handleFocusOut);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('click', handleFocusOut);
      document.removeEventListener('focusin', handleFocusOut);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      {...rest}
      // Prevent tab navigation
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
        }
        if (rest.onKeyDown) {
          rest.onKeyDown(e);
        }
      }}
    />
  );
};

export default PersistentFocusInput;
