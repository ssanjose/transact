import React from 'react';
import { AccountController } from '@/hooks/account.controller';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '@/lib/validation/formSchemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Account } from '@/lib/db/db.model';

const AccountForm = ({ className, onSave, existingAccount }: { className?: string, onSave: () => void, existingAccount?: Account }) => {
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    mode: "onChange",
    defaultValues: {
      id: existingAccount?.id || undefined,
      name: existingAccount?.name || "",
      balance: existingAccount?.balance || 0.00,
    },
  });

  const onSubmit = async (values: z.infer<typeof accountSchema>) => {
    const account = {
      name: values.name,
      balance: (Math.round(values.balance * 100) / 100),
    };

    if (existingAccount && existingAccount.id !== undefined)
      await AccountController.updateAccount(existingAccount.id, account);
    else await AccountController.createAccount(account);

    form.reset();
    onSave();
  }

  return (
    <Form {...form}>
      <form className={cn("grid items-start gap-4", className)} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Account Name
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder="Chequing" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Account Balance
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={!!existingAccount} placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }} />
        <Button type="submit">{existingAccount ? "Edit " : "Create an "}Account</Button>
      </form>
    </Form>
  )
};

export { AccountForm };