"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
    success?: boolean;
    message?: string;
    redirectTo?: string;
    error?: string;
    user?: {
        id: number;
        email: string;
        role: "YOUTH" | "OFFICIAL" | "ADMIN";
        status: "ACTIVE" | "INACTIVE";
    };
};

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });

            const data: LoginResponse =
                await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    "Invalid email or password."
                );
                return;
            }

            /*
             * Use the authenticated user's actual role.
             *
             * ADMIN    -> /admin
             * OFFICIAL -> /admin
             * YOUTH    -> /youth
             */
            if (data.user?.role === "ADMIN") {
                router.replace("/admin");
                router.refresh();
                return;
            }

            if (data.user?.role === "OFFICIAL") {
                router.replace("/admin");
                router.refresh();
                return;
            }

            if (data.user?.role === "YOUTH") {
                router.replace("/youth");
                router.refresh();
                return;
            }

            /*
             * Fallback if the server did not return
             * a recognized role.
             */
            if (data.redirectTo) {
                router.replace(data.redirectTo);
                router.refresh();
                return;
            }

            setError(
                "Login successful, but your account role could not be determined."
            );
        } catch (err) {
            console.error("Login request error:", err);

            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-green-800 px-8 py-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm">
                                <img
                                    src="/sk-logo.png"
                                    alt="SK Tagumpay Logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-200">
                                    SK TAGUMPAY
                                </p>

                                <h1 className="mt-1 text-2xl font-extrabold">
                                    Welcome Back
                                </h1>
                            </div>
                        </div>

                        <p className="mt-5 text-sm leading-6 text-green-100">
                            Log in to access the SK Tagumpay Youth
                            Hub.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-bold text-slate-700"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                    disabled={loading}
                                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-bold text-slate-700"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    disabled={loading}
                                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                    <p className="text-sm font-semibold leading-5 text-red-700">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-green-800 px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Log In"}
                            </button>
                        </form>

                        {/* Register */}
                        <div className="mt-7 border-t border-slate-200 pt-6 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?
                            </p>

                            <a
                                href="/auth/register"
                                className="mt-1 inline-block text-sm font-extrabold text-green-700 hover:text-green-800"
                            >
                                Create an account
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-400">
                    © 2026 SK Tagumpay Youth Hub
                </p>
            </div>
        </main>
    );
}