import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllProfessors = async (req: Request, res: Response) => {
  try {
    const professors = await prisma.professor.findMany({
      include: {
        courses: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(professors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching professors' });
  }
};

export const getProfessorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const professor = await prisma.professor.findUnique({
      where: { id: parseInt(id) },
      include: {
        courses: true,
      },
    });

    if (!professor) {
      res.status(404).json({ error: 'Professor not found' });
      return;
    }

    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching professor' });
  }
};

export const createProfessor = async (req: Request, res: Response) => {
  try {
    const { employeeId, firstName, lastName, email, phone, specialty, department, status } = req.body;

    const professor = await prisma.professor.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        phone,
        specialty,
        department,
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json(professor);
  } catch (error) {
    res.status(500).json({ error: 'Error creating professor' });
  }
};

export const updateProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const professor = await prisma.professor.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: 'Error updating professor' });
  }
};

export const deleteProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.professor.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting professor' });
  }
};