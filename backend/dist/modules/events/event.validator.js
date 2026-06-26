"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.createEventSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const dateSchema = zod_1.z.coerce.date();
exports.createEventSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(3, "Title must be at least 3 characters"),
    description: zod_1.z.string().trim().min(10, "Description must be at least 10 characters"),
    venue: zod_1.z.string().trim().min(2, "Venue is required"),
    eventDate: dateSchema,
    registrationDeadline: dateSchema,
    maxParticipants: zod_1.z.coerce.number().int().positive("Maximum participants must be a positive integer"),
    fee: zod_1.z.coerce.number().nonnegative("Fee must be zero or greater"),
    category: zod_1.z.nativeEnum(client_1.EventCategory),
});
exports.updateEventSchema = exports.createEventSchema.partial();
