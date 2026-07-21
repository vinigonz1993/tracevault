import { faker } from "@faker-js/faker";
import { prisma } from "../../db/prisma.js";

export const createTestUsers = async (
  organizations: { id: string }[],
  count = 5,
) => {
  return Promise.all(
    Array.from({ length: count }).map(() => {
      const organization = faker.helpers.arrayElement(organizations);

      return prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          organizations: {
            connect: {
              id: organization.id,
            },
          },
        },
      });
    }),
  );
};