import { Request, Response } from "express";
import { prisma } from "../db/prisma.js";

export const listOrganizations = async (
  _req: Request,
  res: Response
) => {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(organizations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch organizations",
    });
  }
};

export const createOrganization = async (
  req: Request,
  res: Response
) => {
    const { name, slug } = req.body;

    if (!name || !slug) {
        return res.status(400).json({
        message: "Organization name and slug are required",
        });
    }

    const existingOrganization = await prisma.organization.findFirst({
		where: {
			OR: [
				{ name },
				{ slug },
			],
		},
    });

    if (existingOrganization) {
		if (existingOrganization.name === name) {
			return res.status(409).json({
				message: "An organization with this name already exists.",
			});
		}

		return res.status(409).json({
			message: "An organization with this slug already exists.",
		});
    }

  try {
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        slug,
      },
    });

    res.status(201).json(newOrganization);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create organization",
    });
  }
};