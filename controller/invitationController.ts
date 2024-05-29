import type { Response, Request } from "express";
import { db } from "../db";
import { invitations, invitationsForm } from "../db/schema";

export const createInv = async (req: Request, res: Response) => {
  try {
    const { name, description, email } = req.body;

    const formIdUUID = crypto.randomUUID();
    const invitationUUID = crypto.randomUUID();

    await db
      .insert(invitations)
      .values({ id: formIdUUID, name: name, createdBy: email, description })
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
