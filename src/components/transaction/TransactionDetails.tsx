'use client';

import React, { useEffect, useState } from 'react';
import { TransactionService } from '@/services/transaction.service';
import { Frequency, Transaction, TransactionType } from '@/lib/db/db.model';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

import { Inter } from 'next/font/google';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/format/formatCurrency';
const inter = Inter({ subsets: ["latin"] });

const DetailsImage = ({ className, transaction }: { className?: string, transaction: Transaction }) => {
  return (
    <div className={cn("overflow-hidden relative", className)}>
      <div className="absolute z-10 bottom-0 left-0 text-black px-2 p-1">
        <h2 className="text-xl font-bold truncate">
          {transaction.name} ({transaction.id})
        </h2>
        <p className="text-sm font-light">
          {transaction.status === "pending" ? "Scheduled" : "Completed"} on {
            format(transaction.date, "MMM dd,yyyy, hh:mm a")
          }
        </p>
      </div>
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
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-12 w-12" />
          </div>
        )
        :
        <>
          {transaction ? (
            <>
              <DetailsImage className="w-full h-1/2" transaction={transaction} />
              <div className="h-1/2 p-2 bg-card-overview/30 text-foreground">
                <DetailsText tL="Category: " tR={transaction.categoryId?.toString() || "None"} />
                <DetailsText tL="Type: " tR={TransactionType[transaction.type]} />
                <DetailsText tL="Frequency: " tR={Frequency[transaction.frequency]} />
                <DetailsText tL="Amount:" tR={formatCurrency(transaction.amount)} />
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

const DetailsText = ({ className, tL, tR }: { className?: string, tL: string, tR: string }) => {
  return (
    <p className={cn("flex justify-between items-center text-sm", className)}>
      <span className="font-light">{tL}</span>
      <span className="font-semibold">{tR}</span>
    </p>
  )
}

export default TransactionDetails;