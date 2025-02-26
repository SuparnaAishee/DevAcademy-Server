import express from 'express';
import { LectureController } from '../controllers/lecture.controller';

const router = express.Router();
const lectureController = new LectureController();


router.post('/create', lectureController.createLecture.bind(lectureController));
router.get('/', LectureController.getAllLectures);
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
