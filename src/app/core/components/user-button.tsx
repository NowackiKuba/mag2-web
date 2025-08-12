import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from './atoms/user-avatar';
import { BarChart4, Contact2Icon, CreditCard, HelpCircle, Languages, Loader, Moon, PencilRuler, Settings2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/lib/config/theme-provider';
import { useTranslation } from 'react-i18next';
import { logos } from '@/lib/constants';
import { useMutation } from '@tanstack/react-query';
import { syncProducts } from '@/features/marketplace/sync-products';
import { toast } from 'sonner';
import { useState } from 'react';
import { IntegrationPlatform } from '@/lib/types/api';
import { useMe } from '@/features/user/get-me';
import SettingsDialog from './dialogs/settings-dialog';

const UserButton = () => {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { data: me } = useMe({});
  const [source, setSource] = useState<string>();
  const { mutate: sync, isPending } = useMutation({
    mutationFn: syncProducts,
    mutationKey: ['syncProducts'],
    onSuccess: () => {
      toast.success(`Successfully synced products`);
    },
    onMutate: (data) => {
      setSource(data);
    },
    onSettled: () => {
      setSource('');
    },
  });

  const [openSettings, setOpenSettings] = useState<boolean>(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='hover:scale-[1.03] active:scale-[1.00] duration-100 ease-linear transition-all cursor-pointer'>
        <UserAvatar username={me?.username[0] ?? 'U'} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[260px]'>
        <DropdownMenuLabel>{t('userButton.license')}: Lifetime</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
          }}
          className='flex items-center justify-between w-full'
        >
          <div className='flex items-center gap-3'>
            <Moon className='text-primary size-5' />
            {t('userButton.darkMode')}
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            i18n.changeLanguage(i18n.language === 'en' ? 'pl' : 'en');
          }}
          className='flex items-center justify-between w-full'
        >
          <div className='flex items-center gap-3'>
            <Languages className='text-primary size-5' />
            {t('userButton.language')}
          </div>
          <p className='font-semibold'>{i18n.language.toUpperCase()}</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='flex items-center gap-3 cursor-pointer'>
            <PencilRuler className='text-primary size-4' />
            {t('userButton.tools.label')}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sync(IntegrationPlatform.ERLI);
              }}
              disabled={isPending}
              className='flex items-center gap-3 cursor-pointer'
            >
              {isPending && source === 'ERLI' ? <Loader className='animate-spin' /> : <img src={`${logos['ERLI']}`} className='size-4' />}
              {t('userButton.tools.syncErli')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sync(IntegrationPlatform.ALLEGRO);
              }}
              disabled={isPending}
              className='flex items-center gap-3 cursor-pointer'
            >
              {isPending && source === 'ALLEGRO' ? <Loader className='animate-spin' /> : <img src={`${logos['ALLEGRO']}`} className='size-4' />}
              {t('userButton.tools.syncAllegro')}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => setOpenSettings(true)} className='flex items-center gap-3'>
          <Settings2 className='text-primary size-5' />
          {t('userButton.settings')}
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center gap-3'>
          <BarChart4 className='text-primary size-5' />
          {t('userButton.analytics')}
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center gap-3'>
          <CreditCard className='text-primary size-5' />
          {t('userButton.billing')}
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center gap-3'>
          <HelpCircle className='text-primary size-5' />
          {t('userButton.help')}
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center gap-3'>
          <Contact2Icon className='text-primary size-5' />
          {t('userButton.contact')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{t('userButton.signOut')}</DropdownMenuItem>
      </DropdownMenuContent>

      <SettingsDialog open={openSettings} setOpen={setOpenSettings} />
    </DropdownMenu>
  );
};

export default UserButton;
