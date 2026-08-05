import { prisma } from "../../db/prisma.js";
import lowercaseStrings from "../../utils/lowercaseStrings.js";

type CreateChangeLogOptions = {
  objectId: string;
  objectType: string;
  operation: string;
  previousState?: object | null;
  currentState?: object;
  userId?: string;
};

export const createChangeLog = async (
  options: CreateChangeLogOptions = {
    objectId: "order-123",
    objectType: "order",
    operation: "update",
    previousState: {
      name: "John",
    },
    currentState: {
      name: "John Doe",
    },
    userId: "user-123",
  }
) => {
  return prisma.changeLog.create({
    data: {
      objectId: lowercaseStrings(options.objectId),
      objectType: lowercaseStrings(options.objectType),
      operation: lowercaseStrings(options.operation),
      previousState: options.previousState ?? {
        name: "John",
      },
      currentState: options.currentState ?? {
        name: "John Doe",
      },
      userId: lowercaseStrings(options.userId ?? "user-123"),
    },
  });
};