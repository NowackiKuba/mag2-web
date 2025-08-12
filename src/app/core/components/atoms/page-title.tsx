import { LucideIcon } from 'lucide-react';

interface PageTitleProps {
  icon: LucideIcon;
  title: string;
  label?: string;
}

const PageTitle = ({ icon: Icon, title, label }: PageTitleProps) => {
  return (
    <div className='flex items-center gap-5'>
      <div className='bg-primary/10 text-primary h-20 w-20 flex border border-border items-center justify-center rounded-lg'>
        <Icon />
      </div>
      <div className='flex flex-col items-start gap-1'>
        <p className='text-3xl font-bold'>{title}</p>
        <p className='text-sm text-muted-foreground'>{label}</p>
      </div>
    </div>
  );
};

export default PageTitle;
