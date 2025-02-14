'use client';

import React, { useEffect, useState } from 'react';
import { TransactionService } from '@/services/transaction.service';
import { Frequency, Transaction, TransactionType } from '@/lib/db/db.model';
import { cn } from '@/lib/utils';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useSettings from '@/hooks/use-settings';
import { formatDate } from '@/lib/format/formatTime';
import { formatCurrency } from '@/lib/format/formatCurrency';
import { AppSettings } from '@/lib/types/settings';

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ["latin"] });

const DetailsImage = ({ className, settings, transaction }: { className?: string, settings: AppSettings, transaction: Transaction }) => {
  return (
    <div className={cn("overflow-hidden relative flex items-end rounded-t-xl", className)}>
      <div className="z-10 h-fit text-black px-2 p-1">
        <h2 className="text-xl font-bold truncate w-64">
          {transaction.name} ({transaction.id})
        </h2>
        <p className="text-sm font-light">
          {transaction.status === "pending" ? "Scheduled" : "Completed"} on {
            formatDate(transaction.date, `${settings.dateFormat}, hh:mm a`)
          }
        </p>
      </div>
      <Image
        src="/pexels-voitkevich-6214459.jpg"
        alt="transaction"
        width={500}
        height={500}
        className="w-full absolute bottom-0 left-0"
      />
    </div>
  )
}

const TransactionDetails = ({ id, className }: { id: number, className?: string }) => {
  const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

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

  if (loading || !transaction) {
    return (
      <Card className={cn("", className, inter.className)}>
        <div className="overflow-hidden relative flex items-end rounded-t-xl w-full h-2/5">
          <Image
            src="/pexels-voitkevich-6214459.jpg"
            alt="transaction"
            width={500}
            height={500}
            className="w-full absolute bottom-0 left-0"
          />
        </div>
        <div className="h-3/5 flex flex-col gap-2 w-full p-2 bg-card-overview/30 text-foreground">
          <div className="flex justify-between items-center">
            <Skeleton className="w-2/5 h-3.5" />
            <Skeleton className="w-[15%] h-3.5" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="w-[20%] h-3.5" />
            <Skeleton className="w-[25%] h-3.5" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="w-[30%] h-3.5" />
            <Skeleton className="w-[35%] h-3.5" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="w-[25%] h-3.5" />
            <Skeleton className="w-1/5 h-3.5" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="w-1/5 h-3.5" />
            <Skeleton className="w-2/5 h-3.5" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("h-fit", className, inter.className)}>
      <DetailsImage className="w-full h-2/5" transaction={transaction} settings={settings} />
      <div className="h-3/5 p-2 bg-card-overview/30 text-foreground">
        <DetailsText tL="Category: " tR={transaction.categoryId?.toString() || "None"} />
        <DetailsText tL="Type: " tR={TransactionType[transaction.type]} />
        <DetailsText tL="Frequency: " tR={Frequency[transaction.frequency]} />
        <DetailsText tL="Amount:" tR={formatCurrency(transaction.amount, settings.currencyFormat)} />
        <DetailsText tL="Status:" tR={transaction.status} />
      </div>
    </Card>
  )
}

const DetailsText = ({ className, tL, tR }: { className?: string, tL: string, tR: string }) => {
  return (
    <p className={cn("flex justify-between items-center text-sm", className)}>
      <span className="font-light">{tL}</span>
      <span className="font-semibold capitalize">{tR}</span>
    </p>
  )
}

export default TransactionDetails;