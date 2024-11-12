import FinanceTrackerDatabase, { Category } from '@/lib/db/db.model';
import { useLiveQuery } from 'dexie-react-hooks';

// Create a new category
function createCategory(category: Category): Promise<number> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.categories, async () => {
    return await FinanceTrackerDatabase.categories.add(category) as number;
  });
}

// Get a category by ID
function getCategory(id: number) {
  return useLiveQuery(async () => await FinanceTrackerDatabase.categories.get(id), [id]);
}

// Get all categories using useLiveQuery
function getAllCategories() {
  return useLiveQuery(async () => await FinanceTrackerDatabase.categories.toArray(), []);
}

// Update a category by ID
function updateCategory(id: number, updatedCategory: Partial<Category>): Promise<number> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    return await FinanceTrackerDatabase.categories.update(id, updatedCategory);
  });
}

// Delete a category by ID
function deleteCategory(id: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.transactions, async () => {
    await FinanceTrackerDatabase.transactions.where({ categoryId: id }).each(transaction => {
      FinanceTrackerDatabase.transactions.update(transaction.id as number, { categoryId: undefined });
    });
    return await FinanceTrackerDatabase.categories.delete(id);
  })
    .catch(error => {
      console.error(error);
    });
}

export const CategoryController = {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};