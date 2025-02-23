import { z } from 'zod';

export const createCourseValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be a positive number'),
  regStart: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(new Date(val).getTime()),
      'Invalid start date',
    ),
  regEnd: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(new Date(val).getTime()),
      'Invalid end date',
    ),
  duration: z.string().min(1, 'Duration is required'),
  totalSeats: z.number().min(1, 'Total seats must be at least 1'),
  totalLesson: z.number().min(1, 'Total lessons must be at least 1'),
  keySkills: z.array(z.string()).optional(),
  totalAssignment: z.number().optional(),
  courseCurriculum: z.array(z.string()).optional(),
  category: z.string().min(1, 'Category is required'),
});

export const updateCourseValidation = z.object({
  title: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  discountPrice: z.number().optional(),
  description: z.string().min(1).optional(),
  thumbnail: z.string().min(1).optional(),
  batch: z.string().optional(),
  regStart: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(new Date(val).getTime()),
      'Invalid start date',
    ),
  regEnd: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(new Date(val).getTime()),
      'Invalid end date',
    ),
  duration: z.string().optional(),
  totalSeats: z.number().min(1).optional(),
  totalLesson: z.number().min(1).optional(),
  keySkills: z.array(z.string()).optional(),
  totalAssignment: z.number().optional(),
  courseCurriculum: z.array(z.string()).optional(),
  category: z.string().min(1).optional(),
});
