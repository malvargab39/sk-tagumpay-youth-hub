import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
    PrismaClient,
    program_status,
} from "../../../generated/prisma/client";
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

/*
 * Require an authenticated Admin.
 */
async function requireAdmin() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
        return null;
    }

    const session = await verifySession(sessionToken);

    if (!session || session.role !== "ADMIN") {
        return null;
    }

    /*
     * Confirm the account still exists and is active.
     */
    const user = await prisma.user.findUnique({
        where: {
            id: session.userId,
        },
        select: {
            id: true,
            role: true,
            status: true,
        },
    });

    if (!user) {
        return null;
    }

    if (user.role !== "ADMIN") {
        return null;
    }

    if (user.status !== "ACTIVE") {
        return null;
    }

    return user;
}

/*
 * Validate program status and return
 * the Prisma enum type.
 */
function getProgramStatus(value: unknown): program_status | null {
    const status = String(value || "PLANNED");

    if (
        status === "PLANNED" ||
        status === "ONGOING" ||
        status === "COMPLETED" ||
        status === "CANCELLED"
    ) {
        return status as program_status;
    }

    return null;
}

/*
 * GET
 * Load all programs.
 */
export async function GET() {
    const admin = await requireAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                error: "Unauthorized.",
            },
            {
                status: 401,
            }
        );
    }

    try {
        const programs = await prisma.program.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            programs,
        });
    } catch (error) {
        console.error("GET /api/programs error:", error);

        return NextResponse.json(
            {
                error: "Failed to load programs.",
            },
            {
                status: 500,
            }
        );
    }
}

/*
 * POST
 * Create a program.
 */
export async function POST(request: Request) {
    const admin = await requireAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                error: "Unauthorized.",
            },
            {
                status: 401,
            }
        );
    }

    try {
        const body = await request.json();

        const name = String(body.name || "").trim();

        const description = body.description
            ? String(body.description).trim()
            : null;

        const status = getProgramStatus(body.status);

        const startDate = body.startDate
            ? new Date(body.startDate)
            : null;

        const endDate = body.endDate
            ? new Date(body.endDate)
            : null;

        if (!name) {
            return NextResponse.json(
                {
                    error: "Program name is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!status) {
            return NextResponse.json(
                {
                    error: "Invalid program status.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            startDate &&
            Number.isNaN(startDate.getTime())
        ) {
            return NextResponse.json(
                {
                    error: "Invalid start date.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            endDate &&
            Number.isNaN(endDate.getTime())
        ) {
            return NextResponse.json(
                {
                    error: "Invalid end date.",
                },
                {
                    status: 400,
                }
            );
        }

        const program = await prisma.program.create({
            data: {
                name,
                description,
                status,
                startDate,
                endDate,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(
            {
                program,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST /api/programs error:", error);

        return NextResponse.json(
            {
                error: "Failed to create program.",
            },
            {
                status: 500,
            }
        );
    }
}

/*
 * PATCH
 * Update a program.
 */
export async function PATCH(request: Request) {
    const admin = await requireAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                error: "Unauthorized.",
            },
            {
                status: 401,
            }
        );
    }

    try {
        const body = await request.json();

        const id = Number(body.id);
        const name = String(body.name || "").trim();

        const description = body.description
            ? String(body.description).trim()
            : null;

        const status = getProgramStatus(body.status);

        if (!id || !name) {
            return NextResponse.json(
                {
                    error: "Program ID and name are required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!status) {
            return NextResponse.json(
                {
                    error: "Invalid program status.",
                },
                {
                    status: 400,
                }
            );
        }

        const startDate = body.startDate
            ? new Date(body.startDate)
            : null;

        const endDate = body.endDate
            ? new Date(body.endDate)
            : null;

        if (
            startDate &&
            Number.isNaN(startDate.getTime())
        ) {
            return NextResponse.json(
                {
                    error: "Invalid start date.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            endDate &&
            Number.isNaN(endDate.getTime())
        ) {
            return NextResponse.json(
                {
                    error: "Invalid end date.",
                },
                {
                    status: 400,
                }
            );
        }

        const program = await prisma.program.update({
            where: {
                id,
            },
            data: {
                name,
                description,
                status,
                startDate,
                endDate,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            program,
        });
    } catch (error) {
        console.error("PATCH /api/programs error:", error);

        return NextResponse.json(
            {
                error: "Failed to update program.",
            },
            {
                status: 500,
            }
        );
    }
}

/*
 * DELETE
 * Delete a program.
 */
export async function DELETE(request: Request) {
    const admin = await requireAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                error: "Unauthorized.",
            },
            {
                status: 401,
            }
        );
    }

    try {
        const body = await request.json();

        const id = Number(body.id);

        if (!id) {
            return NextResponse.json(
                {
                    error: "Program ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        await prisma.program.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("DELETE /api/programs error:", error);

        return NextResponse.json(
            {
                error: "Failed to delete program.",
            },
            {
                status: 500,
            }
        );
    }
}