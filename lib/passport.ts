import type { Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = async (
  token: string,
  SECRET: string,
  res: Response
) => {
  if (!token) {
    return res.status(401).json({ error: "You are not Authorized!" });
  }

  try {
    const payload = jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Token is not valid! " });

      return user;
    });

    return payload;
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
