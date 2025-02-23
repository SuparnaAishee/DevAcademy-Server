import express from 'express';
import { userControllers } from '../controllers/user.controller';
import { userValidationSchema } from '../validation/user.validation';
import validateRequest from '../middlewares/validateRequest';
import { AuthValidation } from '../modules/Auth/auth.validation';
import { AuthControllers } from '../modules/Auth/auth.controller';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(userValidationSchema),
  userControllers.createUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.get(
  '/:email',

  userControllers.getSingleUserByEmail,
);

export const UserRoutes = router;
