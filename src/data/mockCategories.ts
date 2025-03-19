// src/data/mockCategories.ts
import { Category } from '../types/Category';

export const categories: Category[] = [
  { id: 'all', name: 'All', icon: '🏠' },
  { id: 'gardener', name: 'Produce', icon: '🥬' },
  { id: 'baker', name: 'Baked', icon: '🍞' },
  { id: 'eggs', name: 'Eggs', icon: '🥚' },
  { id: 'homecook', name: 'Prepared', icon: '🍲' },
  { id: 'specialty', name: 'Specialty', icon: '✨' }
];

// Also export as Categories for backward compatibility (if needed)
export const Categories = categories;