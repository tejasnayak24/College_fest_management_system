import type { Request, Response } from "express";
import { eventService, EventError } from "./event.service";

class EventController {
  public createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const event = await eventService.createEvent(req.body, req.user.id);
      res.status(201).json({ success: true, event });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await eventService.listEvents(req.query);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventId = req.params.id;
      const id = Array.isArray(eventId) ? eventId[0] : eventId;

      if (!id) {
        res.status(400).json({ success: false, message: "Event id is required" });
        return;
      }

      const event = await eventService.getEventById(id);
      res.status(200).json({ success: true, event });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const eventId = req.params.id;
      const id = Array.isArray(eventId) ? eventId[0] : eventId;

      if (!id) {
        res.status(400).json({ success: false, message: "Event id is required" });
        return;
      }

      const event = await eventService.updateEvent(id, req.body, req.user.id, req.user.role);
      res.status(200).json({ success: true, event });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const eventId = req.params.id;
      const id = Array.isArray(eventId) ? eventId[0] : eventId;

      if (!id) {
        res.status(400).json({ success: false, message: "Event id is required" });
        return;
      }

      const result = await eventService.deleteEvent(id, req.user.id, req.user.role);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof EventError) {
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

export const eventController = new EventController();
