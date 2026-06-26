"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthError = exports.prisma = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const auth_validator_1 = require("./auth.validator");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
class AuthError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 400, details) {
        super(message);
        this.name = "AuthError";
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AuthError = AuthError;
class AuthService {
    async signup(input) {
        const parsed = auth_validator_1.signupSchema.safeParse(input);
        if (!parsed.success) {
            throw new AuthError("Validation failed", 400, parsed.error.flatten().fieldErrors);
        }
        const existingUser = await exports.prisma.user.findUnique({
            where: { email: parsed.data.email },
        });
        if (existingUser) {
            throw new AuthError("An account with this email already exists", 409);
        }
        const hashedPassword = await bcrypt_1.default.hash(parsed.data.password, 12);
        const user = await exports.prisma.user.create({
            data: {
                name: parsed.data.name,
                email: parsed.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        const token = this.generateToken(user.id);
        return {
            success: true,
            token,
            user: this.sanitizeUser(user),
        };
    }
    async login(input) {
        const parsed = auth_validator_1.loginSchema.safeParse(input);
        if (!parsed.success) {
            throw new AuthError("Validation failed", 400, parsed.error.flatten().fieldErrors);
        }
        const user = await exports.prisma.user.findUnique({
            where: { email: parsed.data.email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new AuthError("Invalid email or password", 401);
        }
        const isPasswordValid = await bcrypt_1.default.compare(parsed.data.password, user.password);
        if (!isPasswordValid) {
            throw new AuthError("Invalid email or password", 401);
        }
        const token = this.generateToken(user.id);
        return {
            success: true,
            token,
            user: this.sanitizeUser(user),
        };
    }
    async getCurrentUser(userId) {
        const user = await exports.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new AuthError("User not found", 404);
        }
        return this.sanitizeUser(user);
    }
    generateToken(userId) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new AuthError("JWT secret is not configured", 500);
        }
        const jwtSecret = secret;
        return jsonwebtoken_1.default.sign({ userId }, jwtSecret, {
            expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d"),
        });
    }
    sanitizeUser(user) {
        const { password: _password, ...safeUser } = user;
        return safeUser;
    }
}
exports.authService = new AuthService();
