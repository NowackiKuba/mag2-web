import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export type MutationOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onMutate?: (data: TData) => void;
  onSettled?: (data: TData) => void;
  override_onSuccess?: (data: TData) => void;
  override_onError?: (error: Error) => void;
  queryKey?: string | string[];
};

export type QueryOptions<TData> = {
  enabled?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
};

export function useMutationWrapper<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData>,
  successMessage?: string
) {
  return useMutation({
    mutationFn,
    onSuccess: options?.override_onSuccess
      ? (data: TData) => {
          options.override_onSuccess?.(data);
          queryClient.invalidateQueries({
            queryKey: options.queryKey ? (Array.isArray(options.queryKey) ? options.queryKey : [options.queryKey]) : [],
            refetchType: 'all',
          });
        }
      : () => {
          toast.success(successMessage);
          queryClient.invalidateQueries({
            queryKey: [options?.queryKey],
            refetchType: 'all',
          });
        },
    onError: options?.override_onError
      ? options.override_onError
      : (error: Error) => {
          toast.error(error.message || 'Coś poszło nie tak', { description: 'Spróbuj ponownie za niedługo.', richColors: true });
          options?.onError?.(error);
        },
    onMutate: options?.onMutate as ((variables: TVariables) => void | Promise<void | undefined> | undefined) | undefined,
    onSettled: options?.onSettled as ((data: TData | undefined, error: Error | null, variables: TVariables, context: void | undefined) => unknown) | undefined,
  });
}

export function useQueryWrapper<TData>(queryKey: any[], queryFn: () => Promise<TData>, options?: QueryOptions<TData>) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled,
  });
}
