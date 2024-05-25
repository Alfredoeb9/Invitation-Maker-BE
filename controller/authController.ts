import { Request, Response } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

async function emailRegex(email: string) {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const isValidEmail = emailRegex.test(email);
  return isValidEmail;
}

const createToken = async (_id: string) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, userName } = req.body;

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

    const token = await createToken(newUser["id"]);

    const link = `${process.env.REACT_APP_AUTH_BASE_URL}/verify-email/${token}`;
    const fullName = firstName + " " + lastName;

    // await sendVerifyingUserEmail(newUser["email"], fullName, link);
    return res
      .status(201)
      .json({ email, token, message: "Email Verification sent...!" });
    // successful sign up
    // return res.status(201).json({ newUser, message: "User signed up" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
