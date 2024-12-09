'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Frequency, Transaction, TransactionType } from '@/lib/db/db.model';
import { TransactionController } from '@/hooks/transaction.controller';

interface TransactionFormProps {
  className?: string;
  accountId: number;
}

const TransactionForm = ({ className, accountId }: TransactionFormProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTransaction: Transaction = {
      name: formData.get('name') as string,
      amount: parseFloat(formData.get('amount') as string),
      date: new Date(formData.get('date') as string),
      accountId: accountId, // Ensure accountId is included
      type: parseInt(formData.get('frequency') as string) as TransactionType, // Assuming 'expense' is a valid TransactionType
      frequency: parseInt(formData.get('frequency') as string) as Frequency, // Assuming 'one-time' is a valid Frequency
    };

    try {
      await TransactionController.createAndApplyTransaction(newTransaction);
      // Optionally, redirect or show a success message
    } catch (error) {
      console.error('Failed to add transaction:', error);
      // Optionally, show an error message
    }
  };

  return (
    <form className={cn("grid items-start gap-4", className)} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" name="amount" required />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" name="date" required />
      </div>
      <div>
        <label htmlFor="type">Type:</label>
        <select id="type" name="type" required>
          <option value="0">Expense</option>
          <option value="1">Income</option>
        </select>
      </div>
      <div>
        <label htmlFor="frequency">Frequency:</label>
        <select id="frequency" name="frequency" required>
          <option value="0">One-time</option>
          <option value="1">Daily</option>
          <option value="2">Weekly</option>
          <option value="3">Monthly</option>
        </select>
      </div>
      <Button type="submit">Create Account</Button>
    </form>
  );
};

export default TransactionForm;