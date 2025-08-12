import { useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ isNext, page }: { isNext: boolean; page: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangePage = (step: number) => {
    const page = searchParams.get('page') ? +searchParams.get('page')! : 1;
    searchParams.set('page', (page + step).toString());
    setSearchParams(searchParams);
  };

  return (
    <div className='flex items-center gap-4'>
      <Button size={'icon'} disabled={page === 1} onClick={() => handleChangePage(-1)}>
        <ChevronLeft />
      </Button>
      <p className='text-lg font-semibold'>{page}</p>
      <Button size={'icon'} disabled={!isNext} onClick={() => handleChangePage(1)}>
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Pagination;
