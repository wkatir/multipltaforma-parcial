import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        professor: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        professor: true,
        enrollments: {
          include: { student: true },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { code, name, description, credits, professorId, maxCapacity, schedule, semester, status } = req.body;

    const course = await prisma.course.create({
      data: {
        code,
        name,
        description,
        credits,
        professorId,
        maxCapacity,
        schedule,
        semester,
        status: status || 'ACTIVE',
      },
      include: {
        professor: true,
      },
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error creating course' });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data,
      include: {
        professor: true,
      },
    });

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error updating course' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting course' });
  }
};

export const getAvailableCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'ACTIVE',
        currentEnrollment: {
          lt: prisma.course.fields.maxCapacity,
        },
      },
      include: {
        professor: true,
      },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching available courses' });
  }
};