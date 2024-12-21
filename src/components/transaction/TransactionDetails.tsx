'use client';

import React, { useEffect, useState } from 'react';
import { TransactionService } from '@/services/transaction.service';
import { Transaction } from '@/lib/db/db.model';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const TransactionDetails = ({ id, className }: { id: number, className?: string }) => {
  const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === -1) {
      setTransaction(undefined);
      return;
    }
    const getTransaction = async () => {
      setLoading(true);
      const t = await TransactionService.getTransactionById(id);
      setTransaction(t);
      setTimeout(() => setLoading(false), 300);
    }
    getTransaction();
  }, [id]);

  return (
    <div className={cn("", className)}>
      {loading ?
        (transaction &&
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-12 w-12" />
          </div>
        )
        :
        <>
          {transaction ? (
            <>
              <h1>Transaction Details</h1>
              <div>
                <p>Name: {transaction.name}</p>
                <p>Amount: {transaction.amount}</p>
                <p>Date: {transaction.date.toDateString()}</p>
                <p>Type: {transaction.type}</p>
                <p>Frequency: {transaction.frequency}</p>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      }
    </div>
  )
}

export default TransactionDetails;