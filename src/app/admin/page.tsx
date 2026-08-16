"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStatistics = {
    registeredYouth: number;
    programs: number;
    upcomingEvents: number;
    announcements: number;
};

export default function AdminPage() {
    const [statistics, setStatistics] =
        useState<DashboardStatistics | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/dashboard", {
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Unable to load dashboard statistics."
                    );
                }

                setStatistics(data.statistics);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to connect to the server."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    return (
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            {/* Page Header */}
            <section className="mb-8">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                    Administration
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Admin Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Welcome back. Manage the SK Tagumpay Youth Hub
                    from one place.
                </p>
            </section>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">
                        Registered Youth
                    </p>

                    <div className="mt-2 text-3xl font-extrabold text-slate-900">
                        {loading
                            ? "..."
                            : statistics?.registeredYouth ?? 0}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Youth member records
                    </p>

                    <Link
                        href="/admin/youth"
                        className="mt-3 inline-block text-xs font-bold text-green-700 hover:text-green-800"
                    >
                        Manage Youth →
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">
                        Programs
                    </p>

                    <div className="mt-2 text-3xl font-extrabold text-slate-900">
                        {loading
                            ? "..."
                            : statistics?.programs ?? 0}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Active and planned programs
                    </p>

                    <Link
                        href="/admin/programs"
                        className="mt-3 inline-block text-xs font-bold text-green-700 hover:text-green-800"
                    >
                        Manage Programs →
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">
                        Upcoming Events
                    </p>

                    <div className="mt-2 text-3xl font-extrabold text-slate-900">
                        {loading
                            ? "..."
                            : statistics?.upcomingEvents ?? 0}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Scheduled activities
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">
                        Announcements
                    </p>

                    <div className="mt-2 text-3xl font-extrabold text-slate-900">
                        {loading
                            ? "..."
                            : statistics?.announcements ?? 0}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Published announcements
                    </p>

                    <Link
                        href="/admin/announcements"
                        className="mt-3 inline-block text-xs font-bold text-green-700 hover:text-green-800"
                    >
                        Manage Announcements →
                    </Link>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">
                    Quick Actions
                </h2>

                <p className="mb-5 mt-1 text-sm text-slate-500">
                    Common administrative tasks.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/admin/youth"
                        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                    >
                        Manage Youth
                    </Link>

                    <Link
                        href="/admin/officials"
                        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                    >
                        Manage Officials
                    </Link>

                    <Link
                        href="/admin/programs"
                        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                    >
                        Manage Programs
                    </Link>

                    <Link
                        href="/admin/announcements"
                        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                    >
                        Manage Announcements
                    </Link>
                </div>
            </section>

            {/* System Status */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-extrabold text-slate-900">
                    System Status
                </h2>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-600" />

                    <strong className="text-sm text-slate-800">
                        Admin authentication is active
                    </strong>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                    Your administrator account is currently
                    authenticated and the dashboard is available.
                </p>
            </section>
        </section>
    );
}