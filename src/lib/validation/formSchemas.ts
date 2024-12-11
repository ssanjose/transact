'use client';

import { z } from 'zod';
import { Frequency, TransactionType } from '@/lib/db/db.model';

const accountSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
  balance: z.preprocess((x) => x ? Number(x) : undefined, z.number({
    message: 'Balance must be a number',
  }).min(0, {
    message: 'Balance must be at least 0',
  }).multipleOf(0.01, {
    message: 'Balance must only have 2 decimal places',
  })),
});

const transactionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
  amount: z.preprocess((x) => x ? Number(x) : undefined, z.number({
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
});

const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
});

const appliedTransactionSchema = z.object({
  id: z.number().optional(),
  date: z.date(),
  amount: z.preprocess((x) => x ? Number(x) : undefined, z.number({
    message: 'Balance must be a number',
  }).min(0, {
    message: 'Balance must be at least 0',
  }).multipleOf(0.01, {
    message: 'Balance must only have 2 decimal places',
  })),
  type: z.nativeEnum(TransactionType, {
    message: 'Type must be either "expense" or "income"',
  }),
  transactionId: z.number(),
  isManuallyUpdated: z.boolean().default(false),
});

export { accountSchema, transactionSchema, categorySchema, appliedTransactionSchema };