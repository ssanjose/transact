import React from 'react';
import { Category } from '@/lib/db/db.model';

export const CategoryContext = React.createContext<Category[] | null | undefined>(null);

export const useCategoryContext = () => {
  const categories = React.useContext(CategoryContext);

  if (categories === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }

  return categories;
}