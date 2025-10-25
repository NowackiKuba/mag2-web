import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getAutorespondedThreads } from '@/features/threads/get-autoresponded-threads';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';

const AutorespondedMessagesDialog = () => {
  const { data: threads, isLoading } = useQuery({
    queryKey: ['getAutorespondedThreads'],
    queryFn: () => getAutorespondedThreads(),
  });

  // console.log(threads); // Debug log removed
  return (
    <Dialog>
      <DialogTrigger>
        <Button size={'icon'} variant={'ghost'}>
          <MessageCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl w-full flex flex-col gap-2'>
        {isLoading && 'loading'}
        {threads?.map((thread) => (
          <p key={thread.id}>{thread.id}</p>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default AutorespondedMessagesDialog;
