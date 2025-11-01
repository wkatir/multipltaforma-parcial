import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllProfessors = async (req: Request, res: Response) => {
  try {
    const {
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '10',
      department
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (department) {
      where.department = { contains: department as string, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { employeeId: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { specialty: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const orderBy: any = {};
    orderBy[sortBy as string] = order === 'asc' ? 'asc' : 'desc';

    const [professors, total] = await Promise.all([
      prisma.professor.findMany({
        where,
        include: {
          courses: true,
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.professor.count({ where })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      professors,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching professors:', error);
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