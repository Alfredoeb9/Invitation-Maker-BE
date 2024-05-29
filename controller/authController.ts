import type { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import { db } from "../db/index.js";
import { users, verificationTokens } from "../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { sendVerifyingUserEmail } from "../lib/mailer.js";
import { randomUUID } from "crypto";

async function emailRegex(email: string) {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const isValidEmail = emailRegex.test(email);
  return isValidEmail;
}

const createToken = async (_id: string) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("req", req);
    const credValues = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, credValues.email));

    if (!user) throw Error("Incorrect Email, try signing up!");

    const doesPasswordMatch = await bcrypt.compare(
      credValues.password,
      user[0].password
    );

    if (!doesPasswordMatch) throw Error("Incorrect login credentials");

    const { password, ...otherDetails } = user[0];

    return res.status(201).json({ ...otherDetails, message: "User Logged in" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, userName } = req.body;

    const isValidEmail = await emailRegex(email);

    if (!isValidEmail || !password)
      throw Error("Please provide a proper email");

    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
      throw Error("Password is not strong enough");
    }

    // check if email is used
    const isUserSignedUp = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    // check if above query not empty
    if (isUserSignedUp.length > 0 && isUserSignedUp !== undefined) {
      return res.status(201).json({ isUserSignedUp, message: "Logged in" });
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);
    const id = randomUUID();

    // else we have a new user and lets put them in the database
    const newUser = await db
      .insert(users)
      .values({ id, email, firstName, lastName, userName, password: hash })
      .returning();

    const userId = newUser[0]?.id;

    const token = await createToken(userId);

    const link = `${process.env.REACT_APP_AUTH_BASE_URL}/verify-email/${token}`;
    const fullName = firstName + " " + lastName;

    await sendVerifyingUserEmail(email, fullName, link);

    await db
      .insert(verificationTokens)
      .values({
        id: userId,
        token: token,
      })
      .returning();

    return res
      .status(201)
      .json({ email, token, message: "Email Verification sent...!" });
    // successful sign up
    // return res.status(201).json({ newUser, message: "User signed up" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;

    if (!token) throw new Error("Please provide a proper link");

    const currentDate = new Date().toLocaleString("sv-SE");

    // update verification
    await db
      .update(verificationTokens)
      .set({ updatedAt: currentDate })
      .where(eq(verificationTokens.id, req["user"]));

    await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, req["user"]));

    return res.status(201).json({ message: "User Authenicated" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
