import type { Request, Response } from "express";
import { authService, AuthError } from "./auth.service";

class AuthController {
  public signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      res.status(200).json({ success: true, user: req.user });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export const authController = new AuthController();
