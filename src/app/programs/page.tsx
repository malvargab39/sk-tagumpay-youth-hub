import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";
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

export default async function ProgramsPage() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
        redirect("/auth/login");
    }

    const session = await verifySession(sessionToken);

    if (!session) {
        redirect("/auth/login");
    }

    const programs = await prisma.program.findMany({
        where: {
            status: {
                not: "CANCELLED",
            },
        },
        include: {
            event: {
                where: {
                    status: {
                        not: "CANCELLED",
                    },
                },
                orderBy: {
                    startDate: "asc",
                },
            },
        },
        orderBy: [
            {
                startDate: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                    >
                        <img
                            src="/sk-logo.png"
                            alt="SK Tagumpay Logo"
                            className="h-11 w-11 rounded-xl object-cover"
                        />

                        <div>
                            <p className="font-bold text-slate-900">
                                SK Tagumpay
                            </p>

                            <p className="text-[10px] font-bold tracking-[0.2em] text-green-700">
                                YOUTH HUB
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                        ← Dashboard
                    </Link>
                </div>
            </header>

            {/* Page Header */}
            <section className="border-b border-green-100 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-700">
                        Youth Hub
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Programs & Activities
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-600">
                        Explore youth programs, activities, and upcoming events
                        organized by SK Tagumpay.
                    </p>
                </div>
            </section>

            {/* Programs */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
                {programs.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                            📋
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                            No programs available
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            There are currently no youth programs available.
                            Check back later for new programs and activities
                            from SK Tagumpay.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {programs.map((program) => (
                            <article
                                key={program.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md sm:p-8"
                            >
                                {/* Program Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                                            {program.status}
                                        </span>

                                        <h2 className="mt-4 text-xl font-extrabold text-slate-900 sm:text-2xl">
                                            {program.name}
                                        </h2>
                                    </div>

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
                                        📋
                                    </div>
                                </div>

                                {/* Description */}
                                {program.description && (
                                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                                        {program.description}
                                    </p>
                                )}

                                {/* Program Dates */}
                                {(program.startDate || program.endDate) && (
                                    <div className="mt-6 rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Program Period
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {program.startDate
                                                ? new Date(
                                                    program.startDate
                                                ).toLocaleDateString(
                                                    "en-PH",
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }
                                                )
                                                : "Date not specified"}

                                            {program.endDate && (
                                                <>
                                                    {" — "}
                                                    {new Date(
                                                        program.endDate
                                                    ).toLocaleDateString(
                                                        "en-PH",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {/* Events */}
                                <div className="mt-6 border-t border-slate-100 pt-6">
                                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                                        Activities & Events
                                    </h3>

                                    {program.event.length === 0 ? (
                                        <p className="mt-3 text-sm text-slate-500">
                                            No activities or events have been
                                            scheduled for this program yet.
                                        </p>
                                    ) : (
                                        <div className="mt-4 space-y-4">
                                            {program.event.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">
                                                                {event.title}
                                                            </h4>

                                                            {event.description && (
                                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                                    {
                                                                        event.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                                                            {event.status}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                Date
                                                            </p>

                                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                                {new Date(
                                                                    event.startDate
                                                                ).toLocaleDateString(
                                                                    "en-PH",
                                                                    {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                Time
                                                            </p>

                                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                                {new Date(
                                                                    event.startDate
                                                                ).toLocaleTimeString(
                                                                    "en-PH",
                                                                    {
                                                                        hour: "numeric",
                                                                        minute: "2-digit",
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>

                                                        {event.location && (
                                                            <div>
                                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                    Location
                                                                </p>

                                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                                    {
                                                                        event.location
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}

                                                        {event.capacity !==
                                                            null && (
                                                                <div>
                                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                        Capacity
                                                                    </p>

                                                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                                                        {
                                                                            event.capacity
                                                                        }{" "}
                                                                        participants
                                                                    </p>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Back */}
                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-slate-500 sm:px-8">
                    © 2026 SK Tagumpay Youth Hub
                </div>
            </footer>
        </main>
    );
}