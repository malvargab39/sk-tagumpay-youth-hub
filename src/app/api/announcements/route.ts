import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
    PrismaClient,
    announcement_status,
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
 * Require an authenticated, active ADMIN account.
 */
async function requireAdmin() {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
        return null;
    }

    const session = await verifySession(sessionToken);

    if (!session) {
        return null;
    }

    /*
     * Session itself must identify an ADMIN.
     */
    if (session.role !== "ADMIN") {
        return null;
    }

    /*
     * Verify the account directly from the database.
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
 * GET
 *
 * Load all announcements for the Admin page.
 *
 * Admin can see:
 * - DRAFT
 * - PUBLISHED
 * - ARCHIVED
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
        const announcements =
            await prisma.announcement.findMany({
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            });

        return NextResponse.json({
            announcements,
        });
    } catch (error) {
        console.error(
            "GET /api/announcements error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to load announcements.",
            },
            {
                status: 500,
            }
        );
    }
}

/*
 * POST
 *
 * Create a new announcement.
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

        const title = String(body.title || "").trim();

        const content = String(
            body.content || ""
        ).trim();

        const statusValue = String(
            body.status || "DRAFT"
        );

        if (!title) {
            return NextResponse.json(
                {
                    error: "Announcement title is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!content) {
            return NextResponse.json(
                {
                    error: "Announcement content is required.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Convert the incoming string into the
         * Prisma announcement_status enum.
         */
        if (
            ![
                "DRAFT",
                "PUBLISHED",
                "ARCHIVED",
            ].includes(statusValue)
        ) {
            return NextResponse.json(
                {
                    error: "Invalid announcement status.",
                },
                {
                    status: 400,
                }
            );
        }

        const status =
            statusValue as announcement_status;

        /*
         * Published announcements receive publishedAt.
         *
         * Drafts and archived announcements do not.
         */
        const publishedAt =
            status === announcement_status.PUBLISHED
                ? new Date()
                : null;

        const announcement =
            await prisma.announcement.create({
                data: {
                    authorId: admin.id,
                    title,
                    content,
                    status,
                    publishedAt,
                    updatedAt: new Date(),
                },
            });

        return NextResponse.json(
            {
                announcement,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "POST /api/announcements error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to create announcement.",
            },
            {
                status: 500,
            }
        );
    }
}

/*
 * PATCH
 *
 * Edit an existing announcement.
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

        const title = String(
            body.title || ""
        ).trim();

        const content = String(
            body.content || ""
        ).trim();

        const statusValue = String(
            body.status || "DRAFT"
        );

        if (!id) {
            return NextResponse.json(
                {
                    error: "Announcement ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!title) {
            return NextResponse.json(
                {
                    error: "Announcement title is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!content) {
            return NextResponse.json(
                {
                    error: "Announcement content is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            ![
                "DRAFT",
                "PUBLISHED",
                "ARCHIVED",
            ].includes(statusValue)
        ) {
            return NextResponse.json(
                {
                    error: "Invalid announcement status.",
                },
                {
                    status: 400,
                }
            );
        }

        const status =
            statusValue as announcement_status;

        /*
         * Get the existing announcement first.
         */
        const existing =
            await prisma.announcement.findUnique({
                where: {
                    id,
                },
            });

        if (!existing) {
            return NextResponse.json(
                {
                    error: "Announcement not found.",
                },
                {
                    status: 404,
                }
            );
        }

        /*
         * PublishedAt rules:
         *
         * DRAFT     -> null
         * ARCHIVED  -> null
         * PUBLISHED -> preserve existing date if available,
         *              otherwise use current date.
         */
        let publishedAt: Date | null = null;

        if (
            status ===
            announcement_status.PUBLISHED
        ) {
            publishedAt =
                existing.publishedAt ??
                new Date();
        }

        const announcement =
            await prisma.announcement.update({
                where: {
                    id,
                },
                data: {
                    title,
                    content,
                    status,
                    publishedAt,
                    updatedAt: new Date(),
                },
            });

        return NextResponse.json({
            announcement,
        });
    } catch (error) {
        console.error(
            "PATCH /api/announcements error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to update announcement.",
            },
            {
                status: 500,
            }
        );
    }
}

/*
 * DELETE
 *
 * Delete an announcement permanently.
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
                    error: "Announcement ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Confirm it exists.
         */
        const existing =
            await prisma.announcement.findUnique({
                where: {
                    id,
                },
            });

        if (!existing) {
            return NextResponse.json(
                {
                    error: "Announcement not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await prisma.announcement.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "DELETE /api/announcements error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to delete announcement.",
            },
            {
                status: 500,
            }
        );
    }
}