import express from 'express';
import { ModuleController } from '../controllers/module.controller';

const router = express.Router();

router.post('/create', ModuleController.createModule);
router.get('/course/:courseId', ModuleController.getModulesByCourse);
router.get('/:moduleId', ModuleController.getModuleById);
router.put('/:moduleId', ModuleController.updateModule);
router.delete('/:moduleId', ModuleController.deleteModule);

export const coursemoduleRoutes = router;
