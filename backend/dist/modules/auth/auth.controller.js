"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    signup = async (req, res) => {
        try {
            const result = await auth_service_1.authService.signup(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    login = async (req, res) => {
        try {
            const result = await auth_service_1.authService.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    getMe = async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }
            res.status(200).json({ success: true, user: req.user });
        }
        catch (error) {
            this.handleError(error, res);
        }
    };
    handleError(error, res) {
        if (error instanceof auth_service_1.AuthError) {
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
exports.authController = new AuthController();
