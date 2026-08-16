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

export default async function AnnouncementsPage() {
    // Get logged-in session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
        redirect("/auth/login");
    }

    // Verify session
    const session = await verifySession(sessionToken);

    if (!session) {
        redirect("/auth/login");
    }

    // Get published announcements from the database
    const announcements = await prisma.announcement.findMany({
        where: {
            status: "PUBLISHED",
        },
        orderBy: [
            {
                publishedAt: "desc",
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
                        Announcements
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-600">
                        Stay updated with the latest announcements,
                        opportunities, and important information from SK
                        Tagumpay.
                    </p>
                </div>
            </section>

            {/* Announcements */}
            <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
                {announcements.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                            📢
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                            No announcements yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            There are currently no published announcements.
                            Check back later for updates from SK Tagumpay.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {announcements.map((announcement) => (
                            <article
                                key={announcement.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md sm:p-8"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                                            Announcement
                                        </span>

                                        <h2 className="mt-4 text-xl font-extrabold text-slate-900 sm:text-2xl">
                                            {announcement.title}
                                        </h2>
                                    </div>

                                    <div className="shrink-0 text-sm text-slate-500">
                                        {new Date(
                                            announcement.publishedAt ??
                                            announcement.createdAt
                                        ).toLocaleDateString("en-PH", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>

                                <div className="mt-5 border-t border-slate-100 pt-5">
                                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                        {announcement.content}
                                    </p>
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