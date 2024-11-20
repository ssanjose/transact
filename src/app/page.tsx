'use client';

// pages/index.tsx
import React, { useState } from 'react';
import AccountForm from '@/components/account/AccountForm';
import { AccountController } from '@/hooks/account.controller';
import { formatCurrency } from '../lib/format/formatCurrency';

const Home = () => {
  const [showForm, setShowForm] = useState(false);

  // Use the getAllAccounts function which already uses useLiveQuery
  const accounts = AccountController.getAllAccounts();

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleCreateAccount = async () => {
    setShowForm(false);
  };

  return (
    <main>
      <div>
        <h1>Finance Tracker</h1>
        <p>Welcome to the Finance Tracker app! This app will help you keep track of your finances.</p>
      </div>

      <div>
        <div>
          <h1> Accounts ({accounts?.length}) </h1>
        </div>
        <div>
          <ul>
            {accounts?.length === 0 ? (
              <li>No accounts available</li>
            ) : (
              accounts?.map((account) => (
                <li key={account.id}>
                  {account.name}: {formatCurrency(account.balance ?? 0.00)}</li>
              ))
            )}
          </ul>
        </div>
        <div>
          Total: {formatCurrency(accounts?.reduce((acc, account) => acc + (account.balance ?? 0), 0) ?? 0)}
        </div>
        <div>
          <button onClick={toggleFormVisibility}>
            {showForm ? 'Hide Form' : 'Open account'}
          </button>

          {showForm && <AccountForm onCreate={handleCreateAccount} />}
        </div>
      </div>
    </main>
  );
};

export default Home;