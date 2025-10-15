import { Input } from '@/components/ui/input';
import React, { useEffect, useRef } from 'react';

interface PersistentFocusInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onInputChange: (value: string) => void;
}

const PersistentFocusInput: React.FC<PersistentFocusInputProps> = ({ onInputChange, value, className, placeholder, disabled, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isUserInteracting = useRef(false);

  // Set initial focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Maintain focus with smarter logic
  useEffect(() => {
    const handleFocusOut = () => {
      // Only refocus if user is not actively interacting with other elements
      if (!isUserInteracting.current && inputRef.current) {
        // Small delay to allow other click handlers to process
        setTimeout(() => {
          if (
            document.activeElement?.tagName !== 'BUTTON' &&
            document.activeElement?.tagName !== 'A' &&
            !document.activeElement?.closest('[role="dialog"]')?.contains(document.activeElement)
          ) {
            inputRef.current?.focus();
          }
        }, 100);
      }
    };

    // Track user interactions
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't interfere with clicks on buttons, links, or interactive elements
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[data-radix-collection-item]')
      ) {
        isUserInteracting.current = true;
        setTimeout(() => {
          isUserInteracting.current = false;
        }, 500);
      }
    };

    // Less aggressive focus checking - only check periodically when not focused
    const intervalId = setInterval(() => {
      if (
        !isUserInteracting.current &&
        document.activeElement !== inputRef.current &&
        document.activeElement?.tagName !== 'BUTTON' &&
        document.activeElement?.tagName !== 'A' &&
        !document.activeElement?.closest('button') &&
        !document.activeElement?.closest('a')
      ) {
        inputRef.current?.focus();
      }
    }, 500); // Increased interval to be less aggressive

    // Add event listeners
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusout', handleFocusOut);
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
