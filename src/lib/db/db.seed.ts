// Seeds for IndexedDB database using dexie

import { Category } from "@/lib/db/db.model";

const categorySeeds: Category[] = [
  {
    name: "Groceries",
    color: "#22c55e", // green-500
  },
  {
    name: "Rent",
    color: "#f97316", // orange-500
  },
  {
    name: "Utilities",
    color: "#3b82f6", // blue-500
  },
  {
    name: "Transportation",
    color: "#f59e0b", // amber-500
  },
  {
    name: "Entertainment",
    color: "#ec4899", // pink-500
  },
  {
    name: "Health",
    color: "#ef4444", // red-500
  },
  {
    name: "Education",
    color: "#84cc16", // lime-500
  },
  {
    name: "Other",
    color: "#6b7280", // gray-500
  },
];

export { categorySeeds };