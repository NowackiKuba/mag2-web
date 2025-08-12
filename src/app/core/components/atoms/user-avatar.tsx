import { cn } from '@/lib/utils';

const UserAvatar = ({ username, className }: { username: string; className?: string }) => {
  return (
    <div className={cn('h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-base font-bold', className)}>{username[0]}</div>
  );
};

export default UserAvatar;
