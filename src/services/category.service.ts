import { Category } from '@/lib/db/db.model';
import FinanceTrackerDatabase from '@/lib/db/db.init';

/**
 * Creates a new category.
 *
 * @param {Category} category - The category object to create.
 * @returns {Promise<number>} - A promise that resolves to the ID of the created category.
 */
function createCategory(category: Category) {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.categories, async () => {
    return await FinanceTrackerDatabase.categories.add(category);
  });
}

/**
 * Gets a category by ID.
 *
 * @param {number} id - The ID of the category to retrieve.
 * @returns {ReturnType<typeof useLiveQuery>} - The category object wrapped in a live query.
 */
function getCategory(id: number) {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.categories, async () => {
    return await FinanceTrackerDatabase.categories.get(id);
  });
}

/**
 * Gets all categories using useLiveQuery.
 *
 * @returns {ReturnType<typeof useLiveQuery>} - An array of all category objects wrapped in a live query.
 */
function getAllCategories() {
  return FinanceTrackerDatabase.transaction('r', FinanceTrackerDatabase.categories, async () => {
    return await FinanceTrackerDatabase.categories.toArray();
  });
}

/**
 * Updates a category by ID.
 *
 * @param {number} id - The ID of the category to update.
 * @param {Partial<Category>} updatedCategory - The updated category object.
 * @returns {Promise<number>} - A promise that resolves to the number of updated records.
 */
function updateCategory(id: number, updatedCategory: Partial<Category>): Promise<number> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.categories, async () => {
    return await FinanceTrackerDatabase.categories.update(id, updatedCategory);
  });
}

/**
 * Deletes a category by ID and sets the categoryId of related transactions to undefined.
 *
 * @param {number} id - The ID of the category to delete.
 * @returns {Promise<void>} - A promise that resolves when the category and related updates are completed.
 */
function deleteCategory(id: number): Promise<void> {
  return FinanceTrackerDatabase.transaction('rw', FinanceTrackerDatabase.categories, FinanceTrackerDatabase.transactions, async () => {
    await FinanceTrackerDatabase.transactions.where({ categoryId: id }).modify({ categoryId: undefined });
    return await FinanceTrackerDatabase.categories.delete(id);
  })
}

export const CategoryService = {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};