import type { Response, Request } from "express";
import { db } from "../db";
import { invitations, invitationsForm } from "../db/schema";

export const createInv = async (req: Request, res: Response) => {
  try {
    // console.log("req", req);
    const { name, description, email } = req.body;
    // const id = req.headers;

    // console.log("id", id);
    console.log("req", req);
    // console.log("id", id);

    const formIdUUID = crypto.randomUUID();
    const invitationUUID = crypto.randomUUID();

    await db
      .insert(invitationsForm)
      .values({ id: invitationUUID, formId: formIdUUID });

    await db
      .insert(invitations)
      .values({ id: formIdUUID, name: name, createdBy: email, description });

    return res.status(201).json({ message: "New invitation created" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
