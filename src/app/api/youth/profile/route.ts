import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../../../generated/prisma/client";
import { verifySession } from "@/lib/session";

const adapter = new PrismaMariaDb({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "sk_tagumpay",
    connectionLimit: 5,
});

const prisma = new PrismaClient({
    adapter,
});

async function getSessionUser() {
    const cookieStore = await cookies();

    const sessionToken =
        cookieStore.get("session")?.value;

    if (!sessionToken) {
        return null;
    }

    const session = await verifySession(sessionToken);

    if (!session) {
        return null;
    }

    return session;
}

export async function GET() {
    try {
        const session = await getSessionUser();

        if (!session) {
            return Response.json(
                {
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                }
            );
        }

        const youth = await prisma.youthprofile.findUnique({
            where: {
                userId: session.userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
            },
        });

        if (!youth) {
            return Response.json(
                {
                    error: "Youth profile not found.",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            youth,
        });
    } catch (error) {
        console.error(
            "GET /api/youth/profile error:",
            error
        );

        return Response.json(
            {
                error: "Unable to load your profile.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSessionUser();

        if (!session) {
            return Response.json(
                {
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                }
            );
        }

        const body = await request.json();

        const firstName = String(
            body.firstName || ""
        ).trim();

        const middleName = String(
            body.middleName || ""
        ).trim();

        const lastName = String(
            body.lastName || ""
        ).trim();

        const birthDate = body.birthDate
            ? String(body.birthDate)
            : null;

        const sex = body.sex
            ? String(body.sex).trim()
            : null;

        const phoneNumber = body.phoneNumber
            ? String(body.phoneNumber).trim()
            : null;

        const address = body.address
            ? String(body.address).trim()
            : null;

        if (!firstName) {
            return Response.json(
                {
                    error: "First name is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!lastName) {
            return Response.json(
                {
                    error: "Last name is required.",
                },
                {
                    status: 400,
                }
            );
        }

        let parsedBirthDate: Date | null = null;

        if (birthDate) {
            parsedBirthDate = new Date(birthDate);

            if (
                Number.isNaN(
                    parsedBirthDate.getTime()
                )
            ) {
                return Response.json(
                    {
                        error: "Invalid birth date.",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }

        const existingYouth =
            await prisma.youthprofile.findUnique({
                where: {
                    userId: session.userId,
                },
            });

        if (!existingYouth) {
            return Response.json(
                {
                    error: "Youth profile not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const youth =
            await prisma.youthprofile.update({
                where: {
                    id: existingYouth.id,
                },
                data: {
                    firstName,
                    middleName:
                        middleName || null,
                    lastName,
                    birthDate: parsedBirthDate,
                    sex: sex || null,
                    phoneNumber:
                        phoneNumber || null,
                    address: address || null,
                    updatedAt: new Date(),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            status: true,
                        },
                    },
                },
            });

        return Response.json({
            success: true,
            message:
                "Profile updated successfully.",
            youth,
        });
    } catch (error) {
        console.error(
            "PUT /api/youth/profile error:",
            error
        );

        return Response.json(
            {
                error:
                    "Something went wrong while updating your profile.",
            },
            {
                status: 500,
            }
        );
    }
}