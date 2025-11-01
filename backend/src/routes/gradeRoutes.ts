import { Router } from 'express';
import {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  getGradesByStudent,
  getGradesByCourse,
} from '../controllers/gradeController';
import { authMiddleware } from '../middleware/auth';

const router: Router = Router();

router.use(authMiddleware);

router.get('/', getAllGrades);
router.get('/:id', getGradeById);
router.get('/student/:studentId', getGradesByStudent);
router.get('/course/:courseId', getGradesByCourse);
router.post('/', createGrade);
router.put('/:id', updateGrade);

export default router;