import Dexie, { EntityTable, Transaction as Tx } from "dexie";
import { Account, Category, Transaction } from "@/lib/db/db.model";
import { categorySeeds } from "./db.seed";

const FinanceTrackerDatabase = new Dexie("FinanceTrackerApp") as Dexie & {
  accounts: EntityTable<Account, 'id'>;
  transactions: EntityTable<Transaction, 'id'>;
  categories: EntityTable<Category, 'id'>;
};

FinanceTrackerDatabase.version(1).stores({
  accounts: "++id, name, balance, startingBalance, createdAt, updatedAt",
  transactions: "++id, name, amount, date, type, frequency, status, accountId, categoryId, transactionId",
  categories: "++id, name, color",
});

// ---------------------- Seeding ----------------------
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
FinanceTrackerDatabase.accounts.hook("creating", function (primaryKey, account, transaction) {
  account.startingBalance = account.balance;
  account.createdAt = new Date();
  account.updatedAt = new Date();

  this.onsuccess = function () {
    console.log("Creating account", account.name);
  }
});

FinanceTrackerDatabase.accounts.hook("deleting", async (primaryKey, transaction) => {
  console.log("Deleting account", primaryKey, transaction.name);
  if (!primaryKey)
    return;
  let deletedItems = await FinanceTrackerDatabase.transactions.where("accountId").equals(primaryKey).delete();
  console.log("Deleted", deletedItems.valueOf(), "related transactions");
});

FinanceTrackerDatabase.accounts.hook("updating", function (mods, primaryKey, account, transaction) {
  this.onsuccess = function () {
    console.log("Updating account", account.name);
  }

  return { updatedAt: new Date() };
});

export default FinanceTrackerDatabase;