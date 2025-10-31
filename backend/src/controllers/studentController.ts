import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching students' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        enrollments: {
          include: { course: true },
        },
        grades: {
          include: { course: true },
        },
      },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching student' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { carnet, firstName, lastName, email, phone, career, status } = req.body;

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [{ carnet }, { email }],
      },
    });

    if (existingStudent) {
      res.status(400).json({ error: 'Carnet or email already exists' });
      return;
    }

    const student = await prisma.student.create({
      data: {
        carnet,
        firstName,
        lastName,
        email,
        phone,
        career,
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error creating student' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error updating student' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.student.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting student' });
  }
};

export const searchStudents = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    const students = await prisma.student.findMany({
      where: {
        OR: [
          { firstName: { contains: q as string, mode: 'insensitive' } },
          { lastName: { contains: q as string, mode: 'insensitive' } },
          { carnet: { contains: q as string, mode: 'insensitive' } },
        ],
      },
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error searching students' });
  }
};