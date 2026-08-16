import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// Prisma
import { PrismaClient } from "../../../generated/prisma/client";
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

export default async function YouthProfilePage() {
    // Get session cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    // Not logged in
    if (!sessionToken) {
        redirect("/auth/login");
    }

    // Verify session
    const session = await verifySession(sessionToken);

    if (!session) {
        redirect("/auth/login");
    }

    // Only YOUTH accounts can access this page
    if (session.role !== "YOUTH") {
        redirect("/admin");
    }

    // Find the logged-in user
    // Then get the youth profile connected to that user.
    const user = await prisma.user.findUnique({
        where: {
            id: session.userId,
        },
        include: {
            youthprofile: true,
        },
    });

    if (!user) {
        redirect("/auth/login");
    }

    const youth = user.youthprofile;

    // User exists but has no youth profile
    if (!youth) {
        return (
            <main className="min-h-screen bg-slate-50 text-slate-900">
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
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        >
                            Dashboard
                        </Link>
                    </div>
                </header>

                <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
                    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
                        <h1 className="text-xl font-bold text-yellow-900">
                            Youth profile not found
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-yellow-800">
                            Your account is logged in, but no youth profile is
                            connected to this account.
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    const fullName = [
        youth.firstName,
        youth.middleName,
        youth.lastName,
    ]
        .filter(Boolean)
        .join(" ");

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
                <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-700">
                        Youth Profile
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-600">
                        View your personal information registered with SK
                        Tagumpay Youth Hub.
                    </p>
                </div>
            </section>

            {/* Profile Content */}
            <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
                {/* Profile Summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-4xl">
                            👤
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-green-700">
                                Youth Member
                            </p>

                            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                                {fullName}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {user.email}
                            </p>
                        </div>

                        <div className="sm:ml-auto">
                            <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
                                {user.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="border-b border-slate-100 pb-5">
                        <h2 className="text-lg font-extrabold text-slate-900">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Information from your registered youth profile.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                First Name
                            </p>

                            <p className="mt-2 font-semibold text-slate-900">
                                {youth.firstName || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Middle Name
                            </p>

                            <p className="mt-2 font-semibold text-slate-900">
                                {youth.middleName || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Last Name
                            </p>

                            <p className="mt-2 font-semibold text-slate-900">
                                {youth.lastName || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Birth Date
                            </p>

                            <p className="mt-2 font-semibold text-slate-900">
                                {youth.birthDate
                                    ? new Date(
                                        youth.birthDate
                                    ).toLocaleDateString("en-PH", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Sex
                            </p>

                            <p className="mt-2 font-semibold text-slate-900">
                                {youth.sex || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Phone Number
                            </p>

                            <p className="mt-2 font-semibold text-slate-900">
                                {youth.phoneNumber || "—"}
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Address
                            </p>

                            <p className="mt-2 font-semibold text-slate-900">
                                {youth.address || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-6">
                    <h2 className="font-bold text-green-900">
                        Account Information
                    </h2>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                                Email
                            </p>

                            <p className="mt-1 text-sm font-semibold text-green-950">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                                Account Status
                            </p>

                            <p className="mt-1 text-sm font-semibold text-green-950">
                                {user.status}
                            </p>
                        </div>
                    </div>
                </div>

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
                <div className="mx-auto max-w-5xl px-5 py-6 text-center text-xs text-slate-500 sm:px-8">
                    © 2026 SK Tagumpay Youth Hub
                </div>
            </footer>
        </main>
    );
}