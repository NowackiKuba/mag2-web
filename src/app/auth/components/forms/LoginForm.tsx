import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoaderPinwheel } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginInput, loginSchema, useLogin } from '@/features/auth/login';

const LoginForm = () => {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin({
    opts: {
      override_onSuccess: (data) => {
        toast.success('Pomyślnie zalogowano do konta', { description: 'Zostaniesz przekierowany', richColors: true });
        if (!data?.userBusinessData?.length || data?.userBusinessData?.length <= 0) {
          navigate('/auth/business-data');
          return;
        }
        const redirectUrl = searchParams?.get('redirect_url') ? searchParams.get('redirect_url')! : '/app/dashboard';
        navigate(redirectUrl);
        form.reset();
      },
    },
  });

  const onSubmit = (data: LoginInput) => {
    mutate({
      ...data,
    });
  };
  return (
    <Form {...form}>
      <form className='flex flex-col gap-6 w-full' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='password'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input {...field} type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='flex items-center gap-2' disabled={isPending} type='submit'>
          {isPending && <LoaderPinwheel className='animate-spin' />}
          Zaloguj Się
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
