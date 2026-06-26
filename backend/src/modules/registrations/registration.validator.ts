import { z } from "zod";

export const createRegistrationSchema = z.object({
  eventId: z.string().cuid("Event id must be a valid cuid"),
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
