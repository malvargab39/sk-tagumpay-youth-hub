import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";

async function getAdminSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
        return {
            error: "You must be logged in.",
            status: 401,
        };
    }

    const session = await verifySession(sessionToken);

    if (!session) {
        return {
            error: "Your session is invalid or expired.",
            status: 401,
        };
    }

    if (session.role !== "ADMIN") {
        return {
            error: "You do not have permission to manage youth records.",
            status: 403,
        };
    }

    return {
        session,
    };
}

export async function GET(_request: NextRequest) {
    try {
        const auth = await getAdminSession();

        if ("error" in auth) {
            return Response.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const youth = await prisma.youthprofile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return Response.json({
            success: true,
            youth,
        });
    } catch (error) {
        console.error("Get youth error:", error);

        return Response.json(
            {
                error:
                    "Something went wrong while loading youth records.",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await getAdminSession();

        if ("error" in auth) {
            return Response.json(
                { error: auth.error },
                { status: auth.status }
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
            !email.trim()
        ) {
            return Response.json(
                {
                    error: "Email address is required.",
                },
                { status: 400 }
            );
        }

        if (
            typeof password !== "string" ||
            !password
        ) {
            return Response.json(
                {
                    error: "Password is required.",
                },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return Response.json(
                {
                    error:
                        "Password must be at least 6 characters.",
                },
                { status: 400 }
            );
        }

        if (
            typeof firstName !== "string" ||
            !firstName.trim()
        ) {
            return Response.json(
                {
                    error: "First name is required.",
                },
                { status: 400 }
            );
        }

        if (
            typeof lastName !== "string" ||
            !lastName.trim()
        ) {
            return Response.json(
                {
                    error: "Last name is required.",
                },
                { status: 400 }
            );
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const existingUser =
            await prisma.user.findUnique({
                where: {
                    email: normalizedEmail,
                },
            });

        if (existingUser) {
            return Response.json(
                {
                    error:
                        "A user with this email already exists.",
                },
                { status: 409 }
            );
        }

        let parsedBirthDate: Date | null = null;

        if (
            typeof birthDate === "string" &&
            birthDate.trim()
        ) {
            const date = new Date(birthDate);

            if (Number.isNaN(date.getTime())) {
                return Response.json(
                    {
                        error:
                            "The birth date is invalid.",
                    },
                    { status: 400 }
                );
            }

            parsedBirthDate = date;
        }

        const passwordHash =
            await hashPassword(password);

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
                        firstName:
                            firstName.trim(),

                        middleName:
                            typeof middleName ===
                                "string" &&
                                middleName.trim()
                                ? middleName.trim()
                                : null,

                        lastName:
                            lastName.trim(),

                        birthDate:
                            parsedBirthDate,

                        sex:
                            typeof sex === "string" &&
                                sex.trim()
                                ? sex.trim()
                                : null,

                        address:
                            typeof address ===
                                "string" &&
                                address.trim()
                                ? address.trim()
                                : null,

                        phoneNumber:
                            typeof phoneNumber ===
                                "string" &&
                                phoneNumber.trim()
                                ? phoneNumber.trim()
                                : null,

                        updatedAt: now,
                    },
                },
            },
            include: {
                youthprofile: true,
            },
        });

        return Response.json(
            {
                success: true,
                message:
                    "Youth account created successfully.",
                youth: user.youthprofile,
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
        console.error(
            "Create youth error:",
            error
        );

        return Response.json(
            {
                error:
                    "Something went wrong while creating the youth account.",
            },
            { status: 500 }
        );
    }
}