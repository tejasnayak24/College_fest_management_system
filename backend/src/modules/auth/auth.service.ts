import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "./auth.validator";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

class AuthService {
  public async signup(input: SignupInput): Promise<{ success: true; token: string; user: AuthenticatedUser }> {
    const parsed = signupSchema.safeParse(input);

    if (!parsed.success) {
      throw new AuthError("Validation failed", 400, parsed.error.flatten().fieldErrors);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      throw new AuthError("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    const user = await prisma.user.create({
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

  public async login(input: LoginInput): Promise<{ success: true; token: string; user: AuthenticatedUser }> {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      throw new AuthError("Validation failed", 400, parsed.error.flatten().fieldErrors);
    }

    const user = await prisma.user.findUnique({
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

    const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password);

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

  public async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    const user = await prisma.user.findUnique({
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

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AuthError("JWT secret is not configured", 500);
    }

    const jwtSecret: string = secret;

    return jwt.sign({ userId }, jwtSecret, {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"],
    });
  }

  private sanitizeUser(user: AuthenticatedUser & { password?: string }): AuthenticatedUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
