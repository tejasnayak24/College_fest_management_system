"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = exports.EventError = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const event_validator_1 = require("./event.validator");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.eventPrisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.eventPrisma = exports.prisma;
}
class EventError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 400, details) {
        super(message);
        this.name = "EventError";
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.EventError = EventError;
class EventService {
    async createEvent(input, organizerId) {
        const parsed = event_validator_1.createEventSchema.safeParse(input);
        if (!parsed.success) {
            throw new EventError("Validation failed", 400, parsed.error.flatten().fieldErrors);
        }
        if (parsed.data.registrationDeadline >= parsed.data.eventDate) {
            throw new EventError("Registration deadline must be before the event date", 400);
        }
        return exports.prisma.event.create({
            data: {
                ...parsed.data,
                organizerId,
            },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async listEvents(query) {
        const page = Math.max(1, Number(query.page ?? 1));
        const limit = Math.min(50, Math.max(1, Number(query.limit ?? 10)));
        const category = query.category;
        const search = query.search?.trim();
        const normalizedCategory = category && Object.values(client_1.EventCategory).includes(category)
            ? category
            : undefined;
        const where = {
            ...(normalizedCategory ? { category: normalizedCategory } : {}),
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                        { venue: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}),
        };
        const totalItems = await exports.prisma.event.count({ where });
        const data = await exports.prisma.event.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { eventDate: "asc" },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        };
    }
    async getEventById(eventId) {
        const event = await exports.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        if (!event) {
            throw new EventError("Event not found", 404);
        }
        return event;
    }
    async updateEvent(eventId, input, userId, userRole) {
        const event = await exports.prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true },
        });
        if (!event) {
            throw new EventError("Event not found", 404);
        }
        if (event.organizerId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new EventError("You are not authorized to update this event", 403);
        }
        const parsed = event_validator_1.updateEventSchema.safeParse(input);
        if (!parsed.success) {
            throw new EventError("Validation failed", 400, parsed.error.flatten().fieldErrors);
        }
        if (parsed.data.registrationDeadline && parsed.data.eventDate && parsed.data.registrationDeadline >= parsed.data.eventDate) {
            throw new EventError("Registration deadline must be before the event date", 400);
        }
        return exports.prisma.event.update({
            where: { id: eventId },
            data: parsed.data,
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async deleteEvent(eventId, userId, userRole) {
        const event = await exports.prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true },
        });
        if (!event) {
            throw new EventError("Event not found", 404);
        }
        if (event.organizerId !== userId && userRole !== client_1.Role.ADMIN) {
            throw new EventError("You are not authorized to delete this event", 403);
        }
        await exports.prisma.event.delete({ where: { id: eventId } });
        return { success: true, message: "Event deleted successfully" };
    }
}
exports.eventService = new EventService();
