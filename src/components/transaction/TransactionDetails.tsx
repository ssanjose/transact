'use client';

import React, { useEffect, useState } from 'react';
import { TransactionService } from '@/services/transaction.service';
import { Transaction } from '@/lib/db/db.model';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ["latin"] });

const DetailsImage = ({ className }: { className?: string }) => {
  return (
    <div className={cn("overflow-hidden relative", className)}>
      <h2 className="absolute z-10 bottom-0 left-0 text-2xl text-black font-bold px-2 p-1">Transaction Details</h2>
      <img
        src="/pexels-voitkevich-6214459.jpg"
        alt="transaction"
        className={cn("w-full")}
      />
    </div>
  )
}

const TransactionDetails = ({ id, className }: { id: number, className?: string }) => {
  const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === -1) {
      setTransaction(undefined);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      const t = await TransactionService.getTransaction(id);
      setLoading(false)
      setTransaction(t);
    }, 300);

    return () => clearTimeout(timeout);
  }, [id]);

  return (
    <div className={cn("h-fit", className, inter.className)}>
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
              <DetailsImage className="w-full h-1/5" />
              <div className="h-4/5 p-2 bg-card-overview text-foreground">
                <h3 className="text-md text-normal truncate mr-10">{transaction.name}</h3>
                <p className="text-sm text-light">Amount: {transaction.amount}</p>
                <p className="text-sm text-light">Date: {transaction.date.toDateString()}</p>
                <p className="text-sm text-light">Type: {transaction.type}</p>
                <p className="text-sm text-light">Frequency: {transaction.frequency}</p>
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