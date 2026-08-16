"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type YouthProfile = {
    id: number;
    userId: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    birthDate: string | null;
    sex: string | null;
    address: string | null;
    phoneNumber: string | null;
};

type DashboardUser = {
    id: number;
    email: string;
    role: string;
    status: string;
    youthprofile: YouthProfile | null;
};

type DashboardStatistics = {
    registeredYouth: number;
    programs: number;
    upcomingEvents: number;
    announcements: number;
};

type DashboardData = {
    user: DashboardUser;
    statistics: DashboardStatistics;
};

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
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

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error ||
                        "Unable to load your dashboard."
                    );
                }

                setData(result);
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

    const youthProfile = data?.user?.youthprofile;

    const fullName = youthProfile
        ? [
            youthProfile.firstName,
            youthProfile.middleName,
            youthProfile.lastName,
        ]
            .filter(Boolean)
            .join(" ")
        : "Youth";

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

                    <div className="text-xs font-bold uppercase tracking-wider text-green-700">
                        Youth
                    </div>
                </div>
            </header>

            {/* Youth Navigation */}
            <nav className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-5 sm:px-8">
                    <Link
                        href="/dashboard"
                        className="whitespace-nowrap border-b-2 border-green-700 py-4 text-sm font-bold text-green-700"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/youth"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        My Profile
                    </Link>

                    <Link
                        href="/programs"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Programs
                    </Link>

                    <Link
                        href="/events"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Events
                    </Link>

                    <Link
                        href="/registrations"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        My Registrations
                    </Link>

                    <Link
                        href="/announcements"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Announcements
                    </Link>

                    <Link
                        href="/certificates"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Certificates
                    </Link>
                </div>
            </nav>

            {/* Welcome Section */}
            <section className="border-b border-green-100 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-700">
                        Youth Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        {loading
                            ? "Welcome to SK Tagumpay Youth Hub"
                            : `Welcome, ${fullName}`}
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-600">
                        Stay connected with youth programs,
                        activities, announcements, and opportunities
                        in Barangay Tagumpay.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {/* Main Cards */}
                <div className="grid gap-5 md:grid-cols-3">
                    {/* My Profile */}
                    <Link
                        href="/youth"
                        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                            👤
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                            My Profile
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            View and manage your youth profile
                            information.
                        </p>

                        <div className="mt-5 text-sm font-bold text-green-700 group-hover:text-green-800">
                            View Profile →
                        </div>
                    </Link>

                    {/* Programs */}
                    <Link
                        href="/programs"
                        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                            📋
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                            Programs & Activities
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Explore available youth programs and
                            community activities.
                        </p>

                        <div className="mt-5 text-sm font-bold text-green-700 group-hover:text-green-800">
                            Explore Programs →
                        </div>
                    </Link>

                    {/* Announcements */}
                    <Link
                        href="/announcements"
                        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                            📢
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                            Announcements
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Stay updated with the latest SK
                            Tagumpay announcements.
                        </p>

                        <div className="mt-5 text-sm font-bold text-green-700 group-hover:text-green-800">
                            View Announcements →
                        </div>
                    </Link>
                </div>

                {/* Youth Hub */}
                <section className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-6 sm:p-8">
                    <h2 className="text-xl font-extrabold text-slate-900">
                        Your Youth Hub
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                        This is your main space for registrations,
                        events, attendance, feedback, and other youth
                        services.
                    </p>
                </section>

                {/* Account Summary */}
                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                My Account
                            </p>

                            <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                                {loading ? "Loading..." : fullName}
                            </h2>

                            {data?.user?.email && (
                                <p className="mt-1 text-sm text-slate-500">
                                    {data.user.email}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-green-600" />

                            <span className="text-sm font-bold text-green-700">
                                {data?.user?.status || "ACTIVE"}
                            </span>
                        </div>
                    </div>
                </section>
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