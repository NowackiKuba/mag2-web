import UserButton from './user-button';
import { navLinks } from '@/lib/constants';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AutorespondedMessagesDialog from './dialogs/autoresponded-messages-dialog';

const Navbar = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  return (
    <div className='w-full bg-transparent dark:bg-black/5 backdrop-blur-md sticky top-0 z-50'>
      <div className='w-full flex items-center justify-between py-4 px-8'>
        {/* Logo */}
        <div className='text-2xl font-extrabold'>
          Secu<span className='text-primary-500'>Stock</span>
        </div>

        {/* Navigation Links */}
        <div className='flex space-x-1'>
          {navLinks.map((link, index) => (
            <div key={index} className='relative'>
              <Link
                to={link.path}
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all duration-200 font-medium ${
                  pathname.startsWith(link.path) ? 'bg-primary text-white shadow-lg shadow-primary-500/30' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <link.icon className='h-5 w-5' />
                {t(link.translationTag)}
              </Link>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3'>
          <AutorespondedMessagesDialog />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
