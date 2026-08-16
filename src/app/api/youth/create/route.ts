import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        // Check the current session
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            return Response.json(
                { error: "You must be logged in." },
                { status: 401 }
            );
        }

        const session = await verifySession(sessionToken);

        if (!session) {
            return Response.json(
                { error: "Your session is invalid or expired." },
                { status: 401 }
            );
        }

        // Only ADMIN users can create youth accounts
        if (session.role !== "ADMIN") {
            return Response.json(
                { error: "You do not have permission to create youth accounts." },
                { status: 403 }
            );
        }

        const body = await request.json();

        const {
            email,
            password,
            firstName,
            middleName,
            lastName,
            birthDate,
            sex,
            address,
            phoneNumber,
        } = body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof firstName !== "string" ||
            typeof lastName !== "string" ||
            !email.trim() ||
            !password ||
            !firstName.trim() ||
            !lastName.trim()
        ) {
            return Response.json(
                {
                    error:
                        "Email, password, first name, and last name are required.",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUser) {
            return Response.json(
                {
                    error: "A user with this email already exists.",
                },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);

        const now = new Date();

        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash,
                role: "YOUTH",
                status: "ACTIVE",
                updatedAt: now,

                youthprofile: {
                    create: {
                        firstName: firstName.trim(),

                        middleName:
                            typeof middleName === "string" && middleName.trim()
                                ? middleName.trim()
                                : null,

                        lastName: lastName.trim(),

                        birthDate:
                            typeof birthDate === "string" && birthDate
                                ? new Date(birthDate)
                                : null,

                        sex:
                            typeof sex === "string" && sex.trim()
                                ? sex.trim()
                                : null,

                        address:
                            typeof address === "string" && address.trim()
                                ? address.trim()
                                : null,

                        phoneNumber:
                            typeof phoneNumber === "string" && phoneNumber.trim()
                                ? phoneNumber.trim()
                                : null,

                        updatedAt: now,
                    },
                },
            },
        });

        return Response.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create youth error:", error);

        return Response.json(
            {
                error: "Something went wrong while creating the youth account.",
            },
            { status: 500 }
        );
    }
}