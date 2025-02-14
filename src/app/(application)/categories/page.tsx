'use client';

import React, { useEffect } from "react";
import ContentContainer from "@/components/common/ContentContainer";
import { DateRange } from "react-day-picker";
import { addMonths } from "date-fns";
import { Transaction } from "@/lib/db/db.model";
import { TransactionService } from "@/services/transaction.service";
import { CategoryService } from "@/services/category.service";
import { TransactionContext } from "@/hooks/use-transaction-context";
import { useLiveQuery } from "dexie-react-hooks";
import DateRangePicker from "@/components/analytics/DateRangePicker";
import CategoryTable from "@/components/category/CategoryTable";
import MostUsedCategory from "@/components/category/MostUsedCategory"
import HighestValueCategory from "@/components/category/HighestValueCategory";
import { OpenCategoryButton } from "@/components/category/CategoryButtons";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryContext } from "@/hooks/use-category-context";
import CategoryPieChart from "@/components/category/CategoryPie";

export default function CategoryPage() {
  const [date, setDate] = React.useState<DateRange>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });
  const [transactions, setTransactions] = React.useState<Transaction[] | null | undefined>(null);
  const categories = useLiveQuery(() => CategoryService.getAllCategories());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const data = await TransactionService.getTransactionsByDate({
        lowerBound: new Date(date.from!.getFullYear(), date.from!.getMonth(), date.from!.getDate(), 0, 0, 0, 0),
        upperBound:
          date.to ?
            new Date(date.to!.getFullYear(), date.to!.getMonth(), date.to!.getDate(), 23, 59, 59, 999) :
            new Date(date.from!.getFullYear(), date.from!.getMonth(), date.from!.getDate(), 23, 59, 59, 999),
        sorted: true
      });
      if (isMounted) setTransactions(data);
    })();

    return () => { isMounted = false; }
  }, [date]);

  return (
    <CategoryContext.Provider value={categories || []}>
      <TransactionContext.Provider value={transactions}>
        <ContentContainer className="flex flex-col gap-2 min-h-screen pt-4">
          <div className="w-full relative flex justify-between items-center">
            <DateRangePicker
              className="w-fit inline-block"
              date={date!}
              setDate={setDate}
            />
            <OpenCategoryButton
              button={
                <Button size="icon" className="p-none rounded-lg w-fit px-3 h-9">
                  <span className="hidden md:block">Add Category</span>
                  <Plus />
                </Button>
              }
            />
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-2">
            <div className="w-full lg:w-3/4 h-fit space-y-2">
              <div className="block md:grid grid-cols-2 space-y-2 md:space-y-0 gap-2 justify-between">
                <MostUsedCategory />
                <HighestValueCategory />
              </div>
              <CategoryPieChart />
            </div>
            <div className="w-full lg:w-1/4">
              <CategoryTable categories={categories || []} />
            </div>
          </div>
        </ContentContainer>
      </TransactionContext.Provider>
    </CategoryContext.Provider>
  );
}