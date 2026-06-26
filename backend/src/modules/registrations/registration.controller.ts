import type { Request, Response } from "express";
import { registrationService, RegistrationError } from "./registration.service";

class RegistrationController {
  public createRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const result = await registrationService.register(req.body, req.user.id);
      res.status(201).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getMyRegistrations = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const result = await registrationService.getMyRegistrations(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getEventRegistrations = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventId = req.params.eventId;
      const id = Array.isArray(eventId) ? eventId[0] : eventId;

      if (!id) {
        res.status(400).json({ success: false, message: "Event id is required" });
        return;
      }

      const result = await registrationService.getEventRegistrations(id);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public cancelRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const registrationId = req.params.id;
      const id = Array.isArray(registrationId) ? registrationId[0] : registrationId;

      if (!id) {
        res.status(400).json({ success: false, message: "Registration id is required" });
        return;
      }

      const result = await registrationService.cancelRegistration(id, req.user.id, req.user.role);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof RegistrationError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
      return;
    }

    res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
}

export const registrationController = new RegistrationController();
