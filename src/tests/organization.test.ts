import axios from "axios";
import { faker } from "@faker-js/faker";
import { prisma } from "../db/prisma.js";
import app from "../app.js";
import { Server } from "node:http";

let server: Server;
let api: ReturnType<typeof axios.create>;

describe("Organizations API", () => {
    beforeAll(async () => {
        server = app.listen(3000);

        await new Promise<void>((resolve) => {
            server.on("listening", () => resolve());
        });

        api = axios.create({
            baseURL: "http://localhost:3000",
        });
    });

    beforeEach(async () => {
        await prisma.organization.deleteMany();

        await prisma.organization.createMany({
            data: Array.from({ length: 3 }).map(() => ({
                name: faker.company.name(),
                slug: `${faker.helpers.slugify(faker.company.name()).toLowerCase()}-${faker.string.uuid()}`,
                description: faker.company.catchPhrase(),
            })),
        });
    });

    afterAll(async () => {
        await server.close();
        await prisma.$disconnect();
    });

    it("should return a list of organizations", async () => {
        const response = await api.get("/organizations");

        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(3);

        expect(response.data[0]).toEqual(
            expect.objectContaining({
                name: expect.any(String),
                slug: expect.any(String),
            })
        );
    });

    it("should return an error when creating duplicated organization", async () => {
        const organization = {
            name: "Test Organization",
            slug: "test-organization",
        };

        await prisma.organization.create({
            data: organization,
        });

        try {
            await api.post("/organizations", organization);

            throw new Error("Expected duplicate organization creation to fail");
        } catch (error: any) {
            expect(error.response.status).toBe(409);

            expect(error.response.data).toEqual({
                message:
                    "An organization with this name already exists.",
            });
        }
    });
});