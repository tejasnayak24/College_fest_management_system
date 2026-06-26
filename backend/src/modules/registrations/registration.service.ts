import { PrismaClient, Prisma, RegistrationStatus, Role } from "@prisma/client";
import { createRegistrationSchema, type CreateRegistrationInput } from "./registration.validator";

const globalForPrisma = globalThis as typeof globalThis & {
  registrationPrisma?: PrismaClient;
};

export const prisma = globalForPrisma.registrationPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.registrationPrisma = prisma;
}

export type RegistrationWithEventAndUser = Prisma.RegistrationGetPayload<{
  include: {
    event: true;
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
      };
    };
  };
}>;

export type RegistrationWithEvent = Prisma.RegistrationGetPayload<{
  include: {
    event: true;
  };
}>;

export type RegistrationWithUser = Prisma.RegistrationGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
      };
    };
  };
}>;

export class RegistrationError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "RegistrationError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class RegistrationService {
  public async register(
    input: CreateRegistrationInput,
    userId: string,
  ): Promise<{ success: true; registration: RegistrationWithEventAndUser }> {
    const parsed = createRegistrationSchema.safeParse(input);

    if (!parsed.success) {
      throw new RegistrationError("Validation failed", 400, parsed.error.flatten().fieldErrors);
    }

    const event = await prisma.event.findUnique({
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

    const existing = await prisma.registration.findUnique({
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

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId: parsed.data.eventId,
        status: RegistrationStatus.CONFIRMED,
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

  public async getMyRegistrations(userId: string): Promise<{ success: true; registrations: RegistrationWithEvent[] }> {
    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, registrations };
  }

  public async getEventRegistrations(eventId: string): Promise<{ success: true; registrations: RegistrationWithUser[] }> {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new RegistrationError("Event not found", 404);
    }

    const registrations = await prisma.registration.findMany({
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

  public async cancelRegistration(registrationId: string, userId: string, userRole: string): Promise<{ success: true; message: string }> {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        user: true,
      },
    });

    if (!registration) {
      throw new RegistrationError("Registration not found", 404);
    }

    if (registration.userId !== userId && userRole !== Role.ADMIN) {
      throw new RegistrationError("You are not authorized to cancel this registration", 403);
    }

    await prisma.registration.delete({ where: { id: registrationId } });

    return { success: true, message: "Registration cancelled successfully" };
  }
}

export const registrationService = new RegistrationService();
