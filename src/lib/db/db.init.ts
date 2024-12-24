import Dexie, { EntityTable, Transaction as Tx } from "dexie";
import { Account, Category, Transaction } from "@/lib/db/db.model";
import { categorySeeds } from "./db.seed";

const FinanceTrackerDatabase = new Dexie("FinanceTrackerApp") as Dexie & {
  accounts: EntityTable<Account, 'id'>;
  transactions: EntityTable<Transaction, 'id'>;
  categories: EntityTable<Category, 'id'>;
};

FinanceTrackerDatabase.version(1).stores({
  accounts: "++id, name, balance",
  transactions: "++id, name, amount, date, type, frequency, accountId, categoryId, transactionId",
  categories: "++id, name, color",
});

FinanceTrackerDatabase.on("populate", function (db: Tx) {
  db.table("categories").bulkAdd(categorySeeds);
});

// ---------------------- Hooks ----------------------
// Transaction Hooks
FinanceTrackerDatabase.transactions.hook("creating", (primaryKey, obj, transaction) => {
  console.log("Creating transaction", obj.name);
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