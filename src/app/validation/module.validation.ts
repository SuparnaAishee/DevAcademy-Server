import { z } from 'zod';

// Regex to validate ObjectId format
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createModuleSchema = z.object({
  course: z.string().regex(objectIdRegex, 'Invalid Course ID'), // Ensure ObjectId format
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  moduleNumber: z.number().int().positive(),
  lectures: z
    .array(z.string().regex(objectIdRegex, 'Invalid Lecture ID'))
    .optional(), // Optional
});

export const updateModuleSchema = z.object({
  course: z.string().regex(objectIdRegex, 'Invalid Course ID').optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  moduleNumber: z.number().int().positive().optional(),
  lectures: z
    .array(z.string().regex(objectIdRegex, 'Invalid Lecture ID'))
    .optional(),
});
