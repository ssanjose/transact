import React, { useState } from 'react';
import { AccountController } from '@/hooks/account.controller';

const AccountForm = ({ onCreate }: { onCreate: () => void }) => {
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
    onCreate();
  };

  return (
    <form onSubmit={handleCreateAccount}>
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
      <button type="submit">Create Account</button>
    </form>
  );
};

export default AccountForm;