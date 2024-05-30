import type { Response, Request } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";

import { invitations, invitationsForm } from "../db/schema";

export const createInv = async (req: Request, res: Response) => {
  try {
    const { name, description, email, userId } = req.body;

    const formIdUUID = crypto.randomUUID();
    const invitationUUID = crypto.randomUUID();

    await db
      .insert(invitations)
      .values({
        id: formIdUUID,
        name: name,
        createdBy: email,
        description,
        createdById: userId,
      })
      .returning();
    await db
      .insert(invitationsForm)
      .values({ id: invitationUUID, formId: formIdUUID });

    return res.status(201).json({ message: "New invitation created" });
  } catch (error) {
    if (
      error.message.includes("UNIQUE constraint failed: inv_invitations.name")
    ) {
      error.message = "Name is taken in your repository";
    }
    return res.status(400).json({ error: error.message });
  }
};

export const getAllInvitations = async (req: Request, res: Response) => {
  try {
    const userId = req["user"];

    const allInvitations = await db
      .select()
      .from(invitations)
      .where(eq(invitations.createdById, userId));

    return res.status(201).json({ allInvitations });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req["user"]) {
      throw new Error("User is not authorized");
    }

    await db.delete(invitations).where(eq(invitations.id, id));
    await db.delete(invitationsForm).where(eq(invitationsForm.id, id));

    return res.status(201).json({ message: "Invitation deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
