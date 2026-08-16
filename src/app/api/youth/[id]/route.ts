import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            return Response.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const session = await verifySession(sessionToken);

        if (!session) {
            return Response.json(
                { error: "Invalid session." },
                { status: 401 }
            );
        }

        if (session.role !== "ADMIN") {
            return Response.json(
                { error: "You do not have permission to view this record." },
                { status: 403 }
            );
        }

        const { id } = await params;
        const youthId = Number(id);

        if (!Number.isInteger(youthId) || youthId <= 0) {
            return Response.json(
                { error: "Invalid youth ID." },
                { status: 400 }
            );
        }

        const youth = await prisma.youthprofile.findUnique({
            where: {
                id: youthId,
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
                { error: "Youth record not found." },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            youth,
        });
    } catch (error) {
        console.error("Get youth error:", error);

        return Response.json(
            { error: "Something went wrong while loading the youth record." },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check login session
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            return Response.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const session = await verifySession(sessionToken);

        if (!session) {
            return Response.json(
                { error: "Invalid session." },
                { status: 401 }
            );
        }

        // Only ADMIN can edit youth records
        if (session.role !== "ADMIN") {
            return Response.json(
                { error: "You do not have permission to edit youth records." },
                { status: 403 }
            );
        }

        const { id } = await params;
        const youthId = Number(id);

        if (!Number.isInteger(youthId) || youthId <= 0) {
            return Response.json(
                { error: "Invalid youth ID." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            firstName,
            middleName,
            lastName,
            birthDate,
            sex,
            address,
            phoneNumber,
        } = body;

        if (
            typeof firstName !== "string" ||
            typeof lastName !== "string" ||
            !firstName.trim() ||
            !lastName.trim()
        ) {
            return Response.json(
                {
                    error: "First name and last name are required.",
                },
                { status: 400 }
            );
        }

        const existingYouth = await prisma.youthprofile.findUnique({
            where: {
                id: youthId,
            },
        });

        if (!existingYouth) {
            return Response.json(
                { error: "Youth record not found." },
                { status: 404 }
            );
        }

        const now = new Date();

        const updatedYouth = await prisma.youthprofile.update({
            where: {
                id: youthId,
            },
            data: {
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
            youth: updatedYouth,
        });
    } catch (error) {
        console.error("Update youth error:", error);

        return Response.json(
            { error: "Something went wrong while updating the youth record." },
            { status: 500 }
        );
    }
}