import { Request, Response } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

async function emailRegex(email: string) {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const isValidEmail = emailRegex.test(email);
  return isValidEmail;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, userName } = req.body;

    const isValidEmail = await emailRegex(email);

    if (!isValidEmail) throw Error("Please provide a proper email");

    // check if email is used
    const isUserSignedUp = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    // check if above query not empty
    if (isUserSignedUp.length > 0 && isUserSignedUp !== undefined) {
      return res.status(201).json({ isUserSignedUp, message: "Logged in" });
    }

    // else we have a new user and lets put them in the database
    const newUser = await db
      .insert(users)
      .values({ email, firstName, lastName, userName })
      .returning();
    return res.status(201).json({ newUser, message: "User signed up" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
