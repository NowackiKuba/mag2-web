import Navbar from './components/navbar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className='flex flex-col w-full h-screen'>
      <Navbar />
      <div className='p-6 w-full h-full max-h-[calc(100%-80px)]'>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
