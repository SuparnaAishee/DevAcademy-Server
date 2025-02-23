import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller';
import {
  createCourseValidation,
  updateCourseValidation,
} from '../validation/course.validation';
import validateRequest from '../middlewares/validateRequest';


const router = express.Router();

router.post('/create', validateRequest(createCourseValidation), createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', validateRequest(updateCourseValidation), updateCourse);
router.delete('/:id', deleteCourse);

export const courseRoutes = router;
