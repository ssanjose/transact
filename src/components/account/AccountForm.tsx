import React, { useState } from 'react';
import { AccountController } from '@/hooks/account.controller';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const AccountForm = ({ className }: React.ComponentProps<"form">) => {
  const [accountName, setAccountName] = useState('');
  const [accountBalance, setAccountBalance] = useState('0.00');

  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newAccount = {
      name: accountName,
      balance: (Math.round(parseFloat(accountBalance) * 100) / 100),
    };
    await AccountController.createAccount(newAccount);
    setAccountName('');
    setAccountBalance('0.00');
  };

  return (
    <form className={cn("grid items-start gap-4", className)} onSubmit={handleCreateAccount}>
      <input
        type="text"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        placeholder="Account Name"
      />
      <input
        type="text"
        value={accountBalance}
        onChange={(e) => setAccountBalance(e.target.value)}
        placeholder="Account Balance"
      />
      <Button type="submit">Create Account</Button>
    </form>
  );
};

export default AccountForm;