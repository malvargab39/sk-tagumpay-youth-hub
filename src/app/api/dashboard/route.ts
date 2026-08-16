import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export async function GET() {
    try {
        const cookieStore = await cookies();

        const sessionToken =
            cookieStore.get("session")?.value;

        if (!sessionToken) {
            return Response.json(
                {
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                }
            );
        }

        const session =
            await verifySession(sessionToken);

        if (!session) {
            return Response.json(
                {
                    error: "Invalid session.",
                },
                {
                    status: 401,
                }
            );
        }

        /*
         * Allow both ADMIN and YOUTH accounts
         * to access the dashboard statistics.
         */
        if (
            session.role !== "ADMIN" &&
            session.role !== "YOUTH"
        ) {
            return Response.json(
                {
                    error:
                        "You do not have permission to view the dashboard.",
                },
                {
                    status: 403,
                }
            );
        }

        const [
            registeredYouth,
            programs,
            upcomingEvents,
            announcements,
        ] = await Promise.all([
            prisma.youthprofile.count(),

            prisma.program.count(),

            prisma.event.count({
                where: {
                    status: "UPCOMING",
                },
            }),

            prisma.announcement.count({
                where: {
                    status: "PUBLISHED",
                },
            }),
        ]);

        return Response.json({
            success: true,

            statistics: {
                registeredYouth,
                programs,
                upcomingEvents,
                announcements,
            },
        });
    } catch (error) {
        console.error(
            "Dashboard statistics error:",
            error
        );

        return Response.json(
            {
                error:
                    "Something went wrong while loading dashboard statistics.",
            },
            {
                status: 500,
            }
        );
    }
}