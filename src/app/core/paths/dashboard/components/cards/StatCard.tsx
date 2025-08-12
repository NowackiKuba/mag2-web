import { Skeleton } from '@/components/ui/skeleton';
import { colorSchemes } from '@/lib/constants';
import { ArrowRight, LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

// Modern trend indicator component
const TrendIndicator = ({ trend, trendValue }: { trend?: 'up' | 'down'; trendValue?: string }) => {
  if (trend === 'up') {
    return (
      <div className='flex items-center gap-1.5 bg-opacity-20 bg-green-500/20 px-2 py-0.5 rounded-full'>
        <TrendingUp className='h-4 w-4 text-green-500' />
        <p className='text-xs font-medium text-green-500'>+{trendValue}%</p>
      </div>
    );
  } else if (trend === 'down') {
    return (
      <div className='flex items-center gap-1.5 bg-opacity-20 bg-red-500/20 border-red-500 border px-2 py-0.5 rounded-full'>
        <TrendingDown className='h-4 w-4 text-red-500' />
        <p className='text-xs font-medium text-red-500'>{trendValue}%</p>
      </div>
    );
  } else {
    return (
      <div className='flex items-center gap-1.5 bg-opacity-20 bg-gray-500 px-2 py-0.5 rounded-full'>
        <ArrowRight className='h-4 w-4 text-gray-500' />
        <p className='text-xs font-medium text-gray-500'>0%</p>
      </div>
    );
  }
};

const StatCard = ({
  className,
  color,
  icon: Icon,
  text,
  value,
  valueUnit,
  showTrend = false,
  trend,
  trendValue,
  isLoading = false,
}: {
  className?: string;
  color: keyof typeof colorSchemes;
  icon: LucideIcon;
  text: string;
  value: string;
  valueUnit?: string;
  showTrend?: boolean;
  trend?: 'up' | 'down';
  trendValue?: string;
  isLoading?: boolean;
}) => {
  const scheme = colorSchemes?.[color];
  return (
    <div className={`${scheme.gradient} ${className} rounded-xl bg-gradient-to-t flex flex-col items-start justify-between py-5 px-6`}>
      <Icon className='h-12 w-12 text-white' />
      <div className='flex flex-col items-start w-full'>
        <p className='text-sm text-gray-400 font-bold'>{text}</p>
        <div className='flex items-center justify-between w-full'>
          {isLoading ? (
            <Skeleton className='h-7 w-44 bg-gray-100/50`' />
          ) : (
            <p className='text-3xl font-bold text-white'>
              {value} <span>{valueUnit}</span>
            </p>
          )}
          {showTrend && !isLoading ? <TrendIndicator trend={trend} trendValue={trendValue} /> : null}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
