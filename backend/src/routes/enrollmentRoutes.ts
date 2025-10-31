import { Router } from 'express';
import {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  deleteEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
} from '../controllers/enrollmentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllEnrollments);
router.get('/:id', getEnrollmentById);
router.get('/student/:studentId', getEnrollmentsByStudent);
router.get('/course/:courseId', getEnrollmentsByCourse);
router.post('/', createEnrollment);
router.delete('/:id', deleteEnrollment);

export default router;