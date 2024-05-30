import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { verifyToken } from "../lib/passport";
import { db } from "../db";
import { users } from "../db/schema";
// import { users } from "../db/schema";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  console.log("running");
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const response = await verifyToken(
      authorization,
      process.env.JWT_SECRET,
      res
    );

    req["user"] = response["_id"];

    return next();
    // req.user = await db.select().from(users).where(eq(users.id, response.id))
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
