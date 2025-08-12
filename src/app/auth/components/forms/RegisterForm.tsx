import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RegisterInput, registerSchema, useRegister } from '@/features/auth/register';
import { useLogin } from '@/features/auth/login';

const RegisterForm = () => {
  const { t } = useTranslation();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });
  const navigate = useNavigate();
  const { mutateAsync: register, isPending } = useRegister({
    opts: {
      override_onSuccess: () => {
        toast.success('Pomyślnie utworzono konto', { description: 'Teraz możesz się zalogować', richColors: true });
        form.reset();
      },
    },
  });

  const login = useLogin({
    opts: {
      override_onSuccess: () => {
        navigate('/auth/business-data');
      },
      override_onError: () => {
        navigate('/auth/login');
      },
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    const payload = await register({ ...data });
    login.mutate({ email: payload.email, password: payload.password });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
        <FormField
          name='username'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>{t('auth.form.register.username')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email')}</FormLabel>
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
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <Input {...field} type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending && <Loader2 className='animate-spin' />}
          {t('auth.signup')}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
