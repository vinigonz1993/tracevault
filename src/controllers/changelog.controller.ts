import { Request, Response } from "express";
import { prisma } from "../db/prisma.js";

export const getChangeLogs = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.max(Number(req.query.pageSize) || 20, 1);

    const skip = (page - 1) * pageSize;

    const [changeLogs, total] = await Promise.all([
      prisma.changeLog.findMany({
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.changeLog.count(),
    ]);

    res.status(200).json({
      data: changeLogs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching change logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createAuditLog = async (
  req: Request,
  res: Response
) => {
  try {
    const { objectId, objectType, operation, previousState, currentState, userId } = req.body;

    const newChangeLog = await prisma.changeLog.create({
      data: {
        objectId,
        objectType,
        operation,
        previousState,
        currentState,
        userId,
      },
    });

    res.status(201).json(newChangeLog);
  } catch (error) {
    console.error("Error creating audit log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};