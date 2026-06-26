import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authService, type AuthenticatedUser, AuthError } from "../modules/auth/auth.service";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Authentication token is required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Authentication token is required" });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ success: false, message: "JWT secret is not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await authService.getCurrentUser(decoded.userId);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }

    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
