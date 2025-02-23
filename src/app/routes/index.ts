import { Router } from 'express';

import { AuthRoutes } from '../modules/Auth/auth.route';

import { UserRoutes } from '../AllRoutes/user.route';
import { courseRoutes } from '../AllRoutes/course.route';
import { coursemoduleRoutes } from '../AllRoutes/module.route';
import { lectureRoutes } from '../AllRoutes/lecture.route';



const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/course',
    route: courseRoutes,
  },
  {
    path: '/module',
    route: coursemoduleRoutes,
  },
  {
    path: '/lecture',
    route: lectureRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
