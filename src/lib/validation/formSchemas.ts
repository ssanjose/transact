'use client';

import { z } from 'zod';
import { Frequency, TransactionType } from '@/lib/db/db.model';

const accountSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
  balance: z.preprocess((x) => x || x === 0 ? Number(x) : undefined, z.number({
    message: 'Balance must be a number',
  }).min(0, {
    message: 'Balance must be at least 0',
  }).multipleOf(0.01, {
    message: 'Balance must only have 2 decimal places',
  })),
});

const transactionSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
  amount: z.preprocess((x) => x || x === 0 ? Number(x) : undefined, z.number({
    message: 'Balance must be a number',
  }).min(0, {
    message: 'Balance must be at least 0',
  }).multipleOf(0.01, {
    message: 'Balance must only have 2 decimal places',
  })),
  date: z.date(),
  type: z.nativeEnum(TransactionType, {
    message: 'Type must be either "expense" or "income"',
  }),
  frequency: z.nativeEnum(Frequency, {
    message: 'Frequency must be either "one-time", "daily", "weekly", or "monthly"',
  }),
  accountId: z.number(),
  categoryId: z.number().optional(),
  transactionId: z.number().optional(),
});

const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'Color must be a valid hex code',
  }),
});

export { accountSchema, transactionSchema, categorySchema };