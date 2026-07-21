import request from "supertest";
import bcrypt from "bcrypt";

import app from "../app.js";
import { prisma } from "../db/prisma.js";

describe("Authentication endpoints", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    await prisma.$disconnect();
  });

  describe("POST /auth/login", () => {
    it("should login a user with valid credentials", async () => {
      const password = "password123";

      const user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "john@example.com",
          password: await bcrypt.hash(password, 10),
        },
      });

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: user.email,
          password,
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: user.id,
            name: user.name,
            email: user.email,
          }),
        })
      );
    });

    it("should reject invalid credentials", async () => {
      const password = "password123";

      await prisma.user.create({
        data: {
          name: "John Doe",
          email: "john@example.com",
          password: await bcrypt.hash(password, 10),
        },
      });

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "john@example.com",
          password: "wrong-password",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Invalid email or password",
      });
    });

    it("should reject login when email is missing", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          password: "password123",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Email and password are required",
      });
    });

    it("should reject login when password is missing", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "john@example.com",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Email and password are required",
      });
    });

    it("should reject login when user does not exist", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Invalid email or password",
      });
    });
  });
});