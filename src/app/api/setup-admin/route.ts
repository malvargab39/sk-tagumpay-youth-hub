import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
    try {
        if (process.env.NODE_ENV === "production") {
            return Response.json(
                { error: "This endpoint is disabled in production." },
                { status: 403 }
            );
        }

        const setupSecret = process.env.SETUP_ADMIN_SECRET;

        if (!setupSecret) {
            return Response.json(
                { error: "SETUP_ADMIN_SECRET is not configured." },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { secret, email, password } = body;

        if (secret !== setupSecret) {
            return Response.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return Response.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return Response.json(
                { error: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return Response.json(
                { error: "A user with this email already exists." },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);

        const admin = await prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash,
                role: "ADMIN",
                status: "ACTIVE",
                updatedAt: new Date(),
            },
        });

        return Response.json({
            success: true,
            message: "Admin account created successfully.",
            user: {
                id: admin.id,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Setup admin error:", error);

        return Response.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}