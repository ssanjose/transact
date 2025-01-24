import React from 'react';
import { Transaction } from '@/lib/db/db.model';

export const TransactionContext = React.createContext<Transaction[] | null | undefined>(null);

export const useTransactionContext = () => {
  const transactions = React.useContext(TransactionContext);

  if (transactions === undefined) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }

  return transactions;
}