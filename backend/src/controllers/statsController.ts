import { Request, Response } from 'express';
import prisma from '../config/database';

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [totalStudents, totalProfessors, totalCourses, totalEnrollments, activeCourses, graduatedStudents] = await Promise.all([
      prisma.student.count(),
      prisma.professor.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.course.count({ where: { status: 'ACTIVE' } }),
      prisma.student.count({ where: { status: 'GRADUATED' } }),
    ]);

    const stats = {
      totalStudents,
      totalProfessors,
      totalCourses,
      totalEnrollments,
      activeCourses,
      graduatedStudents,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
};
