import { useMe } from '@/features/user/get-me';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthLayout = () => {
  const { data: me, isLoading } = useMe({});
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && me) {
      navigate('/app/dashboard');
    }
  }, [me, isLoading]);

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
