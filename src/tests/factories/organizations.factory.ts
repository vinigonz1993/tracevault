import { faker } from "@faker-js/faker";
import { prisma } from "../../db/prisma.js";

export const createTestOrganizations = async (count = 3) => {
  await prisma.organization.createMany({
    data: Array.from({ length: count }).map(() => ({
      name: faker.company.name(),
      slug: `${faker.helpers.slugify(faker.company.name()).toLowerCase()}-${faker.string.uuid()}`,
      description: faker.company.catchPhrase(),
    })),
  });

  return prisma.organization.findMany();
};