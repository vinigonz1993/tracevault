import request from "supertest";

import app from "../app.js";
import { prisma } from "../db/prisma.js";
import { createChangeLog } from "./factories/changelog.js";

describe("Change Log endpoints", () => {
  beforeEach(async () => {
    await prisma.changeLog.deleteMany();
  });

  afterAll(async () => {
    await prisma.changeLog.deleteMany();

    await prisma.$disconnect();
  });

  describe("POST /change-logs", () => {
    it("should create an change log", async () => {
      const payload = {
        objectId: "order-123",
        objectType: "Order",
        operation: "create",
        previousState: {
          status: "pending",
        },
        currentState: {
          status: "confirmed",
        },
        userId: "user-123",
      };

      const response = await request(app)
        .post("/change-logs")
        .send(payload);

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        ...payload,
        objectId: payload.objectId.toLowerCase(),
        objectType: payload.objectType.toLowerCase(),
        operation: payload.operation.toLowerCase(),
        userId: payload.userId.toLowerCase(),
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();

      const changeLog = await prisma.changeLog.findUnique({
        where: {
          id: response.body.id,
        },
      });

      expect(changeLog).not.toBeNull();
      expect(changeLog).toMatchObject({
        ...payload,
        objectId: payload.objectId.toLowerCase(),
        objectType: payload.objectType.toLowerCase(),
        operation: payload.operation.toLowerCase(),
        userId: payload.userId.toLowerCase(),
      });
    });

    it("should create an change log with a null previous state", async () => {
      const payload = {
        objectId: "patient-123",
        objectType: "Patient",
        operation: "CREATE",
        previousState: null,
        currentState: {
          name: "John Doe",
        },
        userId: "user-123",
      };

      const response = await request(app)
        .post("/change-logs")
        .send(payload);

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        ...payload,
        previousState: null,
        objectId: payload.objectId.toLowerCase(),
        objectType: payload.objectType.toLowerCase(),
        operation: payload.operation.toLowerCase(),
        userId: payload.userId.toLowerCase(),
      });

      const count = await prisma.changeLog.count();

      expect(count).toBe(1);
    });
  });

  describe("GET /change-logs", () => {
    it("should retrieve change logs with pagination", async () => {
      await createChangeLog({
        objectId: "123",
        objectType: "Patient",
        operation: "update",
        userId: "user-123",
      });

      await createChangeLog({
        objectId: "456",
        objectType: "Order",
        operation: "create",
        userId: "user-123",
      });

      const response = await request(app)
        .get("/change-logs")
        .query({
          page: 1,
          pageSize: 1,
        });

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        objectId: "456",
        objectType: "order",
        operation: "create",
      });

      expect(response.body.pagination).toEqual({
        page: 1,
        pageSize: 1,
        total: 2,
        totalPages: 2,
      });
    });

    it("should filter change logs by objectId and objectType", async () => {
      await createChangeLog({
        objectId: "123",
        objectType: "Patient",
        operation: "update",
      });

      await createChangeLog({
        objectId: "456",
        objectType: "Order",
        operation: "create",
      });

      const response = await request(app)
        .get("/change-logs")
        .query({
          objectId: "123",
          objectType: "patient",
        });

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        objectId: "123",
        objectType: "patient",
        operation: "update",
      });

      expect(response.body.pagination).toEqual({
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe("GET /change-logs/object-types", () => {
    it("should return all unique object types", async () => {
      await createChangeLog({
        objectId: "123",
        objectType: "customer",
        operation: "update",
      });

      await createChangeLog({
        objectId: "456",
        objectType: "order",
        operation: "create",
      });

      await createChangeLog({
        objectId: "457",
        objectType: "order",
        operation: "create",
      });

      await createChangeLog({
        objectId: "778",
        objectType: "product",
        operation: "create",
      });

      const response = await request(app)
        .get("/change-logs/object-types")
        .expect(200);

      const expected = await prisma.changeLog.findMany({
        distinct: ["objectType"],
        select: {
          objectType: true,
        },
        orderBy: {
          objectType: "asc"
        }
      })

      expect(response.body).toEqual({
        data: expected.map((entry) => entry.objectType),
      });
    });

    it("should return an empty array when there are no change logs", async () => {
      const response = await request(app)
        .get("/change-logs/object-types")
        .expect(200);

      expect(response.body).toEqual({
        data: [],
      });
    });
  });
});
