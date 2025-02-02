'use client';

import React from 'react';
import { AccountService } from '@/services/account.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '@/lib/validation/formSchemas';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Account } from '@/lib/db/db.model';
import { useRouter } from 'next/navigation';

import { Inter } from 'next/font/google';
import { appLinks } from '@/config/site';
const inter = Inter({ subsets: ["latin"] });

interface AccountFormProps {
  className?: string;
  onSave: () => void;
  existingAccount?: Account;
}

const AccountForm = ({ className, onSave, existingAccount }: AccountFormProps) => {
  const router = useRouter();
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
      await AccountService.updateAccount(existingAccount.id, account);
    else {
      let newAccId = await AccountService.createAccount(account);
      router.push(`${appLinks.account}/${newAccId}`);
    }
    onSave();
  }

  return (
    <Form {...form}>
      <form className={cn("flex flex-col items-start gap-2", className, inter.className)} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>
                  Name
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder="Chequing" />
                </FormControl>
                <FormMessage />
                {!existingAccount && <FormDescription className="text-muted-foreground font-normal">Name of the account.</FormDescription>}
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>
                  Balance
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={!!existingAccount} placeholder="0.00" />
                </FormControl>
                <FormMessage />
                {!existingAccount && <FormDescription className="text-muted-foreground font-normal">Initial balance when created.</FormDescription>}
              </FormItem>
            );
          }} />
        <div className="flex gap-2 mt-2">
          <Button type="submit">{existingAccount ? "Edit " : "Create an "}Account</Button>
          <Button variant="outline" onClick={(e) => {
            e.preventDefault();
            onSave();
          }}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
};

export { AccountForm };