import { format } from "date-fns";
import { Account, Category, Transaction } from "@/lib/db/db.model";
import { AccountService } from "@/services/account.service";
import { CategoryService } from "@/services/category.service";

interface TransactionProps extends Transaction {
  account?: Account;
  category?: Category;
}

interface SeparatedTransaction {
  key: string;
  transactions: TransactionProps[];
  total: number;
}

/**
 * Separate the transaction data into separate arrays based on the date and add a total for each date
 * @param transactions The transactions to separate
 * @returns An array of separated transactions
 */
const separateByDateFormat = async (transactions: Transaction[]): Promise<SeparatedTransaction[]> => {
  const separated: SeparatedTransaction[] = [];
  const transactionMap: { [key: string]: { transactions: TransactionProps[], total: number } } = {};

  for (const transaction of transactions) {
    const key = format(transaction.date, "MMMM d, yyyy");

    if (!transactionMap[key]) {
      transactionMap[key] = { transactions: [], total: 0 };
    }

    const account = await AccountService.getAccount(transaction.accountId);
    let category;
    if (transaction.categoryId) {
      category = await CategoryService.getCategory(transaction.categoryId);
    }

    transactionMap[key].transactions.push({
      ...transaction,
      account: account,
      category: category,
    });

    if (transaction.type === 0) transactionMap[key].total -= transaction.amount;
    else if (transaction.type === 1) transactionMap[key].total += transaction.amount;
  }

  for (const key in transactionMap) {
    separated.push({
      key,
      transactions: transactionMap[key].transactions,
      total: transactionMap[key].total,
    });
  }

  return separated;
};

export { separateByDateFormat };
export type { SeparatedTransaction };