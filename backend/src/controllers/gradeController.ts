import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllGrades = async (req: Request, res: Response) => {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        student: true,
        course: true,
      },
    });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching grades' });
  }
};

export const getGradeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const grade = await prisma.grade.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: true,
        course: true,
      },
    });

    if (!grade) {
      res.status(404).json({ error: 'Grade not found' });
      return;
    }

    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching grade' });
  }
};

export const createGrade = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, partial1, partial2, partial3, comments } = req.body;

    const grade = await prisma.grade.create({
      data: {
        studentId,
        courseId,
        partial1,
        partial2,
        partial3,
        comments,
      },
      include: {
        student: true,
        course: true,
      },
    });

    res.status(201).json(grade);
  } catch (error) {
    res.status(500).json({ error: 'Error creating grade' });
  }
};

export const updateGrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.partial1 && data.partial2 && data.partial3) {
      const finalGrade = (data.partial1 + data.partial2 + data.partial3) / 3;
      data.finalGrade = finalGrade;
      data.status = finalGrade >= 6 ? 'APPROVED' : 'FAILED';
    }

    const grade = await prisma.grade.update({
      where: { id: parseInt(id) },
      data,
      include: {
        student: true,
        course: true,
      },
    });

    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: 'Error updating grade' });
  }
};

export const getGradesByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const grades = await prisma.grade.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        course: {
          include: {
            professor: true,
          },
        },
      },
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching student grades' });
  }
};

export const getGradesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const grades = await prisma.grade.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        student: true,
      },
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course grades' });
  }
};