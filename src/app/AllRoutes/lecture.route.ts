import express from 'express';
import { LectureController } from '../controllers/lecture.controller';

const router = express.Router();
const lectureController = new LectureController();

// Routes for managing lectures
router.post('/create', lectureController.createLecture.bind(lectureController));
router.get(
  '/module/:moduleId',
  lectureController.getLectures.bind(lectureController),
);
router.get(
  '/:lectureId',
  lectureController.getLectureById.bind(lectureController),
);
router.put(
  '/:lectureId',
  lectureController.updateLecture.bind(lectureController),
);
router.delete(
  '/:lectureId',
  lectureController.deleteLecture.bind(lectureController),
);

export const lectureRoutes = router;
