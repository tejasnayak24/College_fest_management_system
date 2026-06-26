"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationService = exports.RegistrationService = exports.RegistrationError = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const registration_validator_1 = require("./registration.validator");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.registrationPrisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.registrationPrisma = exports.prisma;
}
class RegistrationError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 400, details) {
        super(message);
        this.name = "RegistrationError";
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.RegistrationError = RegistrationError;
class RegistrationService {
    async register(input, userId) {
        const parsed = registration_validator_1.createRegistrationSchema.safeParse(input);
        if (!parsed.success) {
            throw new RegistrationError("Validation failed", 400, parsed.error.flatten().fieldErrors);
        }
        const event = await exports.prisma.event.findUnique({
            where: { id: parsed.data.eventId },
            include: {
                registrations: {
                    select: { id: true },
                },
            },
        });
        if (!event) {
            throw new RegistrationError("Event not found", 404);
        }
        if (event.registrationDeadline < new Date()) {
            throw new RegistrationError("Registration deadline has passed", 400);
        }
        if (event.registrations.length >= event.maxParticipants) {
            throw new RegistrationError("Event capacity has been reached", 400);
        }
        const existing = await exports.prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId: parsed.data.eventId,
                },
            },
        });
        if (existing) {
            throw new RegistrationError("You are already registered for this event", 409);
        }
        const registration = await exports.prisma.registration.create({
            data: {
                userId,
                eventId: parsed.data.eventId,
                status: client_1.RegistrationStatus.CONFIRMED,
            },
            include: {
                event: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return { success: true, registration };
    }
    async getMyRegistrations(userId) {
        const registrations = await exports.prisma.registration.findMany({
            where: { userId },
            include: {
                event: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, registrations };
    }
    async getEventRegistrations(eventId) {
        const event = await exports.prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            throw new RegistrationError("Event not found", 404);
        }
        const registrations = await exports.prisma.registration.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, registrations };
    }
    async cancelRegistration(registrationId, userId, userRole) {
        const registration = await exports.prisma.registration.findUnique({
            where: { id: registrationId },
            include: {
                user: true,
            },
        });
        if (!registration) {
            throw new RegistrationError("Registration not found", 404);
        }
        if (registration.userId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new RegistrationError("You are not authorized to cancel this registration", 403);
        }
        await exports.prisma.registration.delete({ where: { id: registrationId } });
        return { success: true, message: "Registration cancelled successfully" };
    }
}
exports.RegistrationService = RegistrationService;
exports.registrationService = new RegistrationService();
