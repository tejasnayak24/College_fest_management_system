import { EventCategory, Prisma, PrismaClient, Role } from "@prisma/client";
import { createEventSchema, updateEventSchema, type CreateEventInput, type UpdateEventInput } from "./event.validator";

const globalForPrisma = globalThis as typeof globalThis & {
  eventPrisma?: PrismaClient;
};

export const prisma = globalForPrisma.eventPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.eventPrisma = prisma;
}

type EventWithOrganizer = Prisma.EventGetPayload<{
  include: {
    organizer: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
      };
    };
  };
}>;

export interface EventListQuery {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
}

export class EventError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "EventError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

class EventService {
  public async createEvent(input: CreateEventInput, organizerId: string): Promise<EventWithOrganizer> {
    const parsed = createEventSchema.safeParse(input);

    if (!parsed.success) {
      throw new EventError("Validation failed", 400, parsed.error.flatten().fieldErrors);
    }

    if (parsed.data.registrationDeadline >= parsed.data.eventDate) {
      throw new EventError("Registration deadline must be before the event date", 400);
    }

    return prisma.event.create({
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

  public async listEvents(query: EventListQuery): Promise<{
    success: true;
    data: EventWithOrganizer[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const page = Math.max(1, Number(query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit ?? 10)));
    const category = query.category;
    const search = query.search?.trim();
    const normalizedCategory = category && Object.values(EventCategory).includes(category as EventCategory)
      ? (category as EventCategory)
      : undefined;

    const where: Prisma.EventWhereInput = {
      ...(normalizedCategory ? { category: normalizedCategory } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
              { venue: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const totalItems = await prisma.event.count({ where });
    const data = await prisma.event.findMany({
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

  public async getEventById(eventId: string): Promise<EventWithOrganizer> {
    const event = await prisma.event.findUnique({
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

  public async updateEvent(eventId: string, input: UpdateEventInput, userId: string, userRole: string): Promise<EventWithOrganizer> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { organizerId: true },
    });

    if (!event) {
      throw new EventError("Event not found", 404);
    }

    if (event.organizerId !== userId && userRole !== Role.ADMIN) {
      throw new EventError("You are not authorized to update this event", 403);
    }

    const parsed = updateEventSchema.safeParse(input);

    if (!parsed.success) {
      throw new EventError("Validation failed", 400, parsed.error.flatten().fieldErrors);
    }

    if (parsed.data.registrationDeadline && parsed.data.eventDate && parsed.data.registrationDeadline >= parsed.data.eventDate) {
      throw new EventError("Registration deadline must be before the event date", 400);
    }

    return prisma.event.update({
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

  public async deleteEvent(eventId: string, userId: string, userRole: string): Promise<{ success: true; message: string }> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { organizerId: true },
    });

    if (!event) {
      throw new EventError("Event not found", 404);
    }

    if (event.organizerId !== userId && userRole !== Role.ADMIN) {
      throw new EventError("You are not authorized to delete this event", 403);
    }

    await prisma.event.delete({ where: { id: eventId } });

    return { success: true, message: "Event deleted successfully" };
  }
}

export const eventService = new EventService();
