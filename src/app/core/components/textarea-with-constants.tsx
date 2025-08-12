import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Brackets, CreditCard, Package2, UserRound } from 'lucide-react';
import { useState, useRef } from 'react';
import { TextareaHTMLAttributes } from 'react';

const TextAreaWithConstants = ({ ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const [val, setVal] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === '{') {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const currentValue = target.value;

      // Insert {} at cursor position
      const newValue = currentValue.slice(0, start) + '{}' + currentValue.slice(end);
      setVal(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(start + 1, start + 1);
        }
      }, 0);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVal(event.target.value);
  };

  return (
    <div className={`${props.className} h-72 rounded-lg border border-border shadow-md p-3 bg-secondary flex flex-col items-start gap-2`}>
      <div className='flex items-center justify-between w-full'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={'ghost'} className='cursor-pointer' type='button'>
              <Brackets />
              Commands List
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className='flex items-center gap-2 text-xs'>
              <UserRound className='size-3 text-muted-foreground' />
              <span className='text-muted-foreground'>User Related</span>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setVal((prev) => prev + `{{user.login}}`)} className='flex items-center gap-2.5 w-full cursor-pointer'>
              <UserRound className='text-primary size-4' />
              <span className='text-sm'>User Login</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVal((prev) => prev + `{{user.first_name}}`)} className='flex items-center gap-2.5 w-full cursor-pointer'>
              <UserRound className='text-primary size-4' />
              <span className='text-sm'>User First Name</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVal((prev) => prev + `{{user.last_name}}`)} className='flex items-center gap-2.5 w-full cursor-pointer'>
              <UserRound className='text-primary size-4' />
              <span className='text-sm'>User Last Name</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className='flex items-center gap-2 text-xs'>
              <Package2 className='size-3 text-muted-foreground' />
              <span className='text-muted-foreground'>Order Related</span>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setVal((prev) => prev + `{{order.id}}`)} className='flex items-center gap-2.5 w-full cursor-pointer'>
              <Package2 className='text-primary size-4' />
              <span className='text-sm'>Order ID</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVal((prev) => prev + `{{order.lineItems.mapped}}`)} className='flex items-center gap-2.5 w-full cursor-pointer'>
              <Package2 className='text-primary size-4' />
              <span className='text-sm'>Ordered Items List</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className='flex items-center gap-2 text-xs'>
              <CreditCard className='size-3 text-muted-foreground' />
              <span className='text-muted-foreground'>Payment Related</span>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setVal((prev) => prev + `{{order.id}}`)} className='flex items-center gap-2.5 w-full cursor-pointer'>
              <CreditCard className='text-primary size-4' />
              <span className='text-sm'>Payment ID</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVal((prev) => prev + `{{order.lineItems.mapped}}`)} className='flex items-center gap-2.5 w-full cursor-pointer'>
              <CreditCard className='text-primary size-4' />
              <span className='text-sm'>Payment Amount</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVal((prev) => prev + `{{order.lineItems.mapped}}`)} className='flex items-center gap-2.5 w-full cursor-pointer'>
              <CreditCard className='text-primary size-4' />
              <span className='text-sm'>Payment Currency</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Textarea
        ref={textareaRef}
        value={val}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className='resize-none ring-0 border-border dark:bg-transparent bg-transparent w-full h-full focus-visible:ring-0 focus-visible:ring-offset-0'
      />
    </div>
  );
};

export default TextAreaWithConstants;
