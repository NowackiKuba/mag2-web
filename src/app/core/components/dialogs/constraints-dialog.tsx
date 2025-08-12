import React, { useMemo, useState } from 'react';
import { UpdateConstraint } from '../forms/update-user-form';
import { DialogProps } from '@/lib/types/common';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

interface Props extends DialogProps {
  constraints: UpdateConstraint[];
}

const ConstraintsDialog: React.FC<Props> = ({ open, setOpen, constraints }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  setCurrentIndex(currentIndex);
  const constraint = useMemo(() => {
    return constraints[currentIndex];
  }, [currentIndex]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='sm:max-w-3xl w-full flex flex-col gap-6'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Verification Required</DialogTitle>
          <DialogDescription>Please complete the verification steps to confirm your changes.</DialogDescription>
        </DialogHeader>
        {constraint.action === 'OTP' ? (
          <div className='flex flex-col gap-12 items-center justify-center'>
            <div className='space-y-1 text-center'>
              <p className='text-3xl font-bold'></p>
              <p className='text-base text-muted-foreground'></p>
            </div>
            <div className='flex items-center justify-center'>
              <InputOTP maxLength={8}>
                <InputOTPSlot className='size-16' index={0} />
                <InputOTPSeparator />
                <InputOTPSlot className='size-16' index={1} />
                <InputOTPSeparator />
                <InputOTPSlot className='size-16' index={2} />
                <InputOTPSeparator />
                <InputOTPSlot className='size-16' index={3} />
                <InputOTPSeparator />
                <InputOTPSlot className='size-16' index={4} />
                <InputOTPSeparator />
                <InputOTPSlot className='size-16' index={5} />
                <InputOTPSeparator />
                <InputOTPSlot className='size-16' index={6} />
                <InputOTPSeparator />
                <InputOTPSlot className='size-16' index={7} />
              </InputOTP>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ConstraintsDialog;
