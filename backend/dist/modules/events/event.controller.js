"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventController = void 0;
const event_service_1 = require("./event.service");
class EventController {
    createEvent = async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }
            const event = await event_service_1.eventService.createEvent(req.body, req.user.id);
            res.status(201).json({ success: true, event });
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    getEvents = async (req, res) => {
        try {
            const result = await event_service_1.eventService.listEvents(req.query);
            res.status(200).json(result);
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    getEventById = async (req, res) => {
        try {
            const eventId = req.params.id;
            const id = Array.isArray(eventId) ? eventId[0] : eventId;
            if (!id) {
                res.status(400).json({ success: false, message: "Event id is required" });
                return;
            }
            const event = await event_service_1.eventService.getEventById(id);
            res.status(200).json({ success: true, event });
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    updateEvent = async (req, res) => {
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
            const event = await event_service_1.eventService.updateEvent(id, req.body, req.user.id, req.user.role);
            res.status(200).json({ success: true, event });
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    deleteEvent = async (req, res) => {
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
            const result = await event_service_1.eventService.deleteEvent(id, req.user.id, req.user.role);
            res.status(200).json(result);
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    handleError(error, res) {
        if (error instanceof event_service_1.EventError) {
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
exports.eventController = new EventController();
