import FinanceTrackerDatabase, { Category } from '@/lib/db/db.model';
import { useLiveQuery } from 'dexie-react-hooks';

// Create a new category
async function createCategory(category: Category): Promise<number> {
  return await FinanceTrackerDatabase.categories.add(category) as number;
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
async function updateCategory(id: number, updatedCategory: Partial<Category>): Promise<number> {
  return await FinanceTrackerDatabase.categories.update(id, updatedCategory);
}

// Delete a category by ID
async function deleteCategory(id: number): Promise<void> {
  await FinanceTrackerDatabase.categories.delete(id);
}

export const CategoryController = {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};