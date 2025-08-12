import { Bot } from 'lucide-react';
import { ReactNode } from 'react';

const AuthCard = ({ children, mode }: { children: ReactNode; mode: 'login' | 'register' }) => {
  return (
    <div className='w-[550px] min-h-[730px] py-4 gap-8 flex px-10 flex-col items-center justify-center bg-card rounded-xl border border-border shadow-md dark:shadow-xl'>
      <div className='flex flex-col items-center gap-5 w-full justify-center'>
        <div className='h-24 w-24 rounded-lg flex items-center justify-center text-white primary-gradient'>
          <Bot className='h-12 w-12' />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <p className='text-xl font-bold'>{mode === 'login' ? 'Witaj Spowrotem' : 'Witaj w App'}</p>
          <p className='text-sm text-muted-foreground'>Wypełnij formularz poniżej aby {mode === 'login' ? 'zalogować się' : 'założyć Konto'}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;
