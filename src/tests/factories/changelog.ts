import { prisma } from "../../db/prisma.js";

type CreateChangeLogOptions = {
  objectId?: string;
  objectType?: string;
  operation?: string;
  previousState?: object | null;
  currentState?: object;
  userId?: string;
};

export const createChangeLog = async (
  options: CreateChangeLogOptions = {}
) => {
  return prisma.changeLog.create({
    data: {
      objectId: options.objectId ?? "object-123",
      objectType: options.objectType ?? "Patient",
      operation: options.operation ?? "UPDATE",
      previousState: options.previousState ?? {
        name: "John",
      },
      currentState: options.currentState ?? {
        name: "John Doe",
      },
      userId: options.userId ?? "user-123",
    },
  });
};