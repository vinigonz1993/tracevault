import { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { changeLogEmitter } from "../services/changeLogEmitter.js";
import lowercaseStrings from "../utils/lowercaseStrings.js";

export const getChangeLogs = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.max(Number(req.query.pageSize) || 20, 1);
    const objectId =
      typeof req.query.objectId === "string"
        ? req.query.objectId.trim()
        : undefined;

    const skip = (page - 1) * pageSize;

    const where = objectId
      ? {
          objectId,
        }
      : undefined;

    const [changeLogs, total] = await Promise.all([
      prisma.changeLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.changeLog.count({
        where,
      }),
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
  res: Response,
) => {
  try {
    const {
      objectId,
      objectType,
      operation,
      previousState,
      currentState,
      userId,
    } = req.body;

    const newChangeLog = await prisma.changeLog.create({
      data: {
        objectId: lowercaseStrings(objectId),
        objectType: lowercaseStrings(objectType),
        operation: lowercaseStrings(operation),
        previousState,
        currentState,
        userId: lowercaseStrings(userId),
      },
    });

    changeLogEmitter.emit("created", newChangeLog);

    res.status(201).json(newChangeLog);
  } catch (error) {
    console.error("Error creating audit log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getObjectTypes = async (
  _req: Request,
  res: Response,
) => {
  try {
    const objectTypes = await prisma.changeLog.findMany({
      distinct: ["objectType"],
      select: {
        objectType: true,
      },
      orderBy: {
        objectType: "asc"
      }
    });

    res.status(200).json({
      data: objectTypes.map((entry) => entry.objectType),
    });
  } catch (error) {
    console.error("Error fetching object types:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};