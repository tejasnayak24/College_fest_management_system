"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationController = void 0;
const registration_service_1 = require("./registration.service");
class RegistrationController {
    createRegistration = async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }
            const result = await registration_service_1.registrationService.register(req.body, req.user.id);
            res.status(201).json(result);
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    getMyRegistrations = async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }
            const result = await registration_service_1.registrationService.getMyRegistrations(req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    getEventRegistrations = async (req, res) => {
        try {
            const eventId = req.params.eventId;
            const id = Array.isArray(eventId) ? eventId[0] : eventId;
            if (!id) {
                res.status(400).json({ success: false, message: "Event id is required" });
                return;
            }
            const result = await registration_service_1.registrationService.getEventRegistrations(id);
            res.status(200).json(result);
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    cancelRegistration = async (req, res) => {
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
            const result = await registration_service_1.registrationService.cancelRegistration(id, req.user.id, req.user.role);
            res.status(200).json(result);
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    handleError(error, res) {
        if (error instanceof registration_service_1.RegistrationError) {
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
exports.registrationController = new RegistrationController();
