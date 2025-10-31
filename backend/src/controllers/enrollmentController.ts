import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: true,
        course: true,
      },
      orderBy: { enrollmentDate: 'desc' },
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching enrollments' });
  }
};

export const getEnrollmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: true,
        course: true,
      },
    });

    if (!enrollment) {
      res.status(404).json({ error: 'Enrollment not found' });
      return;
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching enrollment' });
  }
};

export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, status } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (course.currentEnrollment >= course.maxCapacity) {
      res.status(400).json({ error: 'No hay cupos disponibles' });
      return;
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      res.status(400).json({ error: 'Student already enrolled in this course' });
      return;
    }

    const enrollment = await prisma.$transaction(async (tx) => {
      const newEnrollment = await tx.enrollment.create({
        data: {
          studentId,
          courseId,
          status: status || 'ENROLLED',
        },
        include: {
          student: true,
          course: true,
        },
      });

      await tx.course.update({
        where: { id: courseId },
        data: {
          currentEnrollment: {
            increment: 1,
          },
        },
      });

      return newEnrollment;
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating enrollment' });
  }
};

export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!enrollment) {
      res.status(404).json({ error: 'Enrollment not found' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.enrollment.delete({
        where: { id: parseInt(id) },
      });

      await tx.course.update({
        where: { id: enrollment.courseId },
        data: {
          currentEnrollment: {
            decrement: 1,
          },
        },
      });
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting enrollment' });
  }
};

export const getEnrollmentsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        course: {
          include: {
            professor: true,
          },
        },
      },
    });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching student enrollments' });
  }
};

export const getEnrollmentsByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        student: true,
      },
    });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course enrollments' });
  }
};