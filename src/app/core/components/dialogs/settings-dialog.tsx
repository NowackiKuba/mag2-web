import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogProps } from '@/lib/types/common';
import { Briefcase, CreditCard, UserRound } from 'lucide-react';
import React, { lazy } from 'react';
const UpdateUserForm = lazy(() => import('../forms/update-user-form'));

const SettingsDialog: React.FC<DialogProps> = ({ open, setOpen }) => {
  const sections = [
    { id: 1, name: 'Profile', icon: UserRound, value: 'profile', body: <UpdateUserForm close={() => setOpen(false)} /> },
    { id: 2, name: 'Company', icon: Briefcase, value: 'company', body: <>company</> },
    { id: 3, name: 'Billing', icon: CreditCard, value: 'billing', body: <>billing</> },
  ];
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='sm:max-w-5xl w-full flex flex-col gap-6 items-start'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Settings</DialogTitle>
          <DialogDescription>Manage your account settings, company information, and billing preferences.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue='profile' className='w-full'>
          <TabsList className='w-full'>
            {sections.map((s) => (
              <TabsTrigger key={s.id} value={s.value} className={`dark:data-[state=active]:bg-background cursor-pointer w-full`}>
                <s.icon />
                <p>{s.name}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.value} className='w-full'>
              {s.body}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
