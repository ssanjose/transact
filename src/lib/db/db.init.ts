import Dexie, { EntityTable } from "dexie";
import { Account, Transaction, Category } from "@/lib/db/db.model";
import { generateChildTransactions } from "../../hooks/transaction.controller";

const FinanceTrackerDatabase = new Dexie("FinanceTrackerApp") as Dexie & {
  accounts: EntityTable<Account, 'id'>;
  transactions: EntityTable<Transaction, 'id'>;
  categories: EntityTable<Category, 'id'>;
};

FinanceTrackerDatabase.version(1).stores({
  accounts: "++id, name, balance",
  transactions: "++id, name, amount, date, type, frequency, accountId, categoryId, transactionId",
  categories: "++id, name",
});

// Transaction Hooks
FinanceTrackerDatabase.transactions.hook("creating", function (primaryKey, obj, transaction) {
  this.onsuccess = function (primaryKey) {
    if (obj.transactionId !== undefined)
      return;

    obj.id = primaryKey;
    const childTransactions = generateChildTransactions(obj);
    for (const childTransaction of childTransactions) {
      FinanceTrackerDatabase.transactions.add(childTransaction);
    }
  };
});

FinanceTrackerDatabase.transactions.hook("deleting", (primaryKey, transaction) => {
  console.log("Deleting transaction", transaction.name);
});

// Account Hooks
FinanceTrackerDatabase.accounts.hook("deleting", async (primaryKey, transaction) => {
  console.log("Deleting account", primaryKey, transaction.name);
  if (!primaryKey)
    return;
  let deletedItems = await FinanceTrackerDatabase.transactions.where("accountId").equals(primaryKey).delete();
  console.log("Deleted", deletedItems.valueOf(), "related transactions");
});

FinanceTrackerDatabase.accounts.hook("updating", (primaryKey, transaction) => {
  console.log("Updating account", transaction);
});

export default FinanceTrackerDatabase;