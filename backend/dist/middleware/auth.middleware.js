"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../modules/auth/auth.service");
const authenticateToken = async (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await auth_service_1.authService.getCurrentUser(decoded.userId);
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof auth_service_1.AuthError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
