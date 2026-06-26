import { EventCategory } from "@prisma/client";
import { z } from "zod";

const dateSchema = z.coerce.date();

export const createEventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  venue: z.string().trim().min(2, "Venue is required"),
  eventDate: dateSchema,
  registrationDeadline: dateSchema,
  maxParticipants: z.coerce.number().int().positive("Maximum participants must be a positive integer"),
  fee: z.coerce.number().nonnegative("Fee must be zero or greater"),
  category: z.nativeEnum(EventCategory),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
