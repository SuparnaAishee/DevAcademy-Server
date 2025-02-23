import { z } from 'zod';

export const createLectureSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  videoLink: z.string().min(1, { message: 'Video link is required' }),
  course: z
    .string()
    .min(1, { message: 'Valid course ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: 'Invalid course ID format',
    }),
  moduleId: z
    .string()
    .min(1, { message: 'Valid module ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: 'Invalid module ID format',
    }),
  videoNum: z.number().int().positive().min(1).optional(),
  duration: z.number().int().positive().min(1).optional(),
});

export const updateLectureSchema = z.object({
  title: z.string().min(1, { message: 'Title cannot be empty' }).optional(),
  description: z
    .string()
    .min(1, { message: 'Description cannot be empty' })
    .optional(),
  videoLink: z
    .string()
    .min(1, { message: 'Video link cannot be empty' })
    .optional(),
  course: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Valid course ID is required' })
    .optional(),
  moduleId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Valid module ID is required' })
    .optional(),
  videoNum: z.number().int().positive().min(1).optional(),
  duration: z.number().int().positive().min(1).optional(),
});
