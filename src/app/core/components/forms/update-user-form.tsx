import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMe } from '@/features/user/get-me';
import { UpdateUserInput, updateUserSchema, useUpdateUser } from '@/features/user/update-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface UpdateConstraint {
  id: number;
  name: string;
  value: string;
  trigger: string;
  action: string;
}

const UPDATE_CONSTRAINTS: Record<string, UpdateConstraint> = {
  email: {
    id: 1,
    name: 'Verify email',
    value: 'verify',
    trigger: 'email_change',
    action: 'OTP',
  },
  password: {
    id: 2,
    name: 'Provide old password',
    value: 'password',
    trigger: 'password_change',
    action: 'provide',
  },
} as const;

const UpdateUserForm = ({ close }: { close: () => void }) => {
  const [constraintFields, setConstraintFields] = useState<Record<string, string>>({});
  const [showConstraintInputs, setShowConstraintInputs] = useState<Record<string, boolean>>({});
  const [constraintsOpen, setConstraintsOpen] = useState<boolean>(false);

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  const { data: me } = useMe({});
  const { mutate: update } = useUpdateUser({
    opts: {
      override_onSuccess: () => {
        toast.success('Successfully updated user');
        close();
        form.reset();
        setConstraintFields({});
        setShowConstraintInputs({});
      },
      queryKey: ['get-me'],
    },
  });

  const getConstraintForField = (fieldName: string): UpdateConstraint | undefined => {
    return UPDATE_CONSTRAINTS[fieldName];
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    const constraint = getConstraintForField(fieldName);
    if (constraint && value !== me?.[fieldName as keyof typeof me]) {
      setShowConstraintInputs((prev) => ({ ...prev, [fieldName]: true }));
    } else {
      setShowConstraintInputs((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const validateConstraintField = (fieldName: string, value: string): boolean => {
    const constraint = getConstraintForField(fieldName);
    if (!constraint) return true;

    switch (constraint.action) {
      case 'OTP':
        return value.length > 0;
      case 'provide':
        return value.length >= 6;
      default:
        return true;
    }
  };

  const onSubmit = (data: UpdateUserInput) => {
    // Validate constraint fields before submission
    const constraintFieldsToValidate = Object.keys(showConstraintInputs).filter((key) => showConstraintInputs[key]);

    for (const fieldName of constraintFieldsToValidate) {
      const constraintValue = constraintFields[fieldName];
      if (!validateConstraintField(fieldName, constraintValue)) {
        toast.error(`${UPDATE_CONSTRAINTS[fieldName]?.name} is required`);
        return;
      }
    }

    // Add constraint values to the submission data
    const submissionData = {
      ...data,
      constraints: constraintFieldsToValidate.reduce((acc, fieldName) => {
        acc[fieldName] = constraintFields[fieldName];
        return acc;
      }, {} as Record<string, string>),
    };

    update(submissionData);
  };

  useEffect(() => {
    if (me) {
      form.reset({
        username: me.username,
        email: me.email,
        password: 'password123',
      });
    }
  }, [me]);

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='username'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('username', e.target.value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('email', e.target.value);
                  }}
                />
              </FormControl>
              {/* {showConstraintInputs.email && constraintsOpen && ( */}
              {/* <div className='mt-2 space-y-12 w-full bg-secondary/50 border border-border shadow-md p-5 rounded-xl'>
                <div className='space-y-1'>
                  <FormLabel className='text-xl font-bold'>{UPDATE_CONSTRAINTS.email.name}</FormLabel>
                  <FormDescription>Enter the 6-digit verification code sent to your email address to confirm the change.</FormDescription>
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

                <Button>Verify</Button>
              </div> */}
              {/* )} */}
            </FormItem>
          )}
        />
        <FormField
          name='password'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='password'
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('password', e.target.value);
                  }}
                />
              </FormControl>
              {/* {showConstraintInputs.password && constraintsOpen && (
                <div className='mt-2 space-y-2'>
                  <FormLabel>{UPDATE_CONSTRAINTS.password.name}</FormLabel>
                  <Input
                    type='password'
                    placeholder='Enter old password'
                    value={constraintFields.password || ''}
                    onChange={(e) => setConstraintFields((prev) => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              )} */}
            </FormItem>
          )}
        />
        <Button
          type={constraintFields ? 'button' : 'submit'}
          onClick={() => {
            if (constraintFields && !constraintsOpen) {
              setConstraintsOpen(true);
            }
          }}
        >
          Update
        </Button>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
