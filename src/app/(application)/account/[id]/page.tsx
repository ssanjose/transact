'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from "next/navigation";
import TransactionTable from '@/components/transaction/TransactionTable';
import TransactionDetails from '@/components/transaction/TransactionDetails';
import { useLiveQuery } from 'dexie-react-hooks';
import { AccountService } from '@/services/account.service';
import AccountMenu from '@/components/account/AccountMenu';
import { OpenTransactionButton } from '@/components/transaction/TransactionButtons';
import ContentContainer from '@/components/common/ContentContainer';
import { cn } from '@/lib/utils';
import AccountTrend from '@/components/account/AccountTrend';
import { Account, Transaction } from '@/lib/db/db.model';
import { TransactionService } from '@/services/transaction.service';
import { AccountAnalyticsService } from '@/services/analytics/account.analytics.service';

const Page = () => {
  const [transactionId, setTransactionId] = useState<number>(-1);
  const accountId = parseInt(useParams<{ id: string }>().id);
  const account = useLiveQuery(() => AccountService.getAccount(accountId));

  if (!account) return;

  return (
    <ContentContainer className="grid grid-cols-4 gap-2">
      <main className={`col-span-4 lg:col-span-3 w-full px-0 sm:p-2 sm:px-0 pt-2`}>
        <div className="flex flex-start justify-between px-2 sm:p-0 sm:pb-2">
          <div className="w-full flex justify-between items-center">
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight mr-2">
              {account.name}
              <span className="text-normal font-normal text-md ml-2">{account ? `(${account.id})` : null}</span>
            </h1>
            <OpenTransactionButton accountId={accountId} />
          </div>
          <AccountMenu account={account} />
        </div>
        <TransactionTable id={accountId} setTransactionId={setTransactionId} />
      </main>
      <aside className="col-span-0 hidden lg:flex lg:flex-col lg:gap-4 lg:col-span-1 mt-4">
        <SpecificAccountTrend account={account} />
        <TransactionDetails id={transactionId} className={`${transactionId !== -1 ? "block" : "hidden"} h-[45vh] sticky top-4`} />
      </aside>
    </ContentContainer>
  );
}

const SpecificAccountTrend = ({
  className,
  account
}: React.HTMLAttributes<HTMLDivElement> & { account: Account }) => {
  const [transactions, setTransactions] = useState<Transaction[] | null | undefined>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const transactions = await TransactionService.getTransactionsByAccount(account.id!);
      if (isMounted) setTransactions(transactions);
    })()

    return () => { isMounted = false; }
  }, [account]);

  const data = useMemo(() => {
    return AccountAnalyticsService.getAccountTrend([account], transactions || []);
  }, [transactions]);

  return (
    <div className={cn("", className)}>
      <AccountTrend
        data={data}
        showHeader={false}
      />
    </div>
  );
}

export default Page;
