import { z } from 'zod';

export const userValidationSchema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email address'),
  password: z.string().max(20, 'Password should not exceed 20 characters'),
  phone: z.string(),

  address: z.string(),
 
  profilePhoto: z.string().optional(), // Optional field
});

export const UserValidations = {
  userValidationSchema,
};
