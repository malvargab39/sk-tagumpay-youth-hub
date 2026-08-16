"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [form, setForm] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function updateField(
        field: keyof typeof form,
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: form.firstName,
                    middleName: form.middleName || null,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                }),
            });

            const text = await response.text();

            let data;

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            if (!response.ok) {
                setError(
                    data.error ||
                    "Unable to create your account."
                );
                return;
            }

            setSuccess(
                "Account created successfully. You can now log in."
            );

            setForm({
                firstName: "",
                middleName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Registration error:", error);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 py-12">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">

                    {/* Left Side */}
                    <div className="bg-green-800 p-8 text-white sm:p-10 lg:p-12">
                        <div className="flex items-center gap-3">
                            <img
                                src="/sk-logo.png"
                                alt="SK Tagumpay Logo"
                                className="h-12 w-12 rounded-xl object-cover"
                            />

                            <div>
                                <p className="font-bold">
                                    SK Tagumpay
                                </p>

                                <p className="text-xs text-green-100">
                                    YOUTH HUB
                                </p>
                            </div>
                        </div>

                        <div className="mt-16">
                            <p className="text-sm font-semibold uppercase tracking-widest text-green-200">
                                Join the community
                            </p>

                            <h1 className="mt-3 text-4xl font-extrabold leading-tight">
                                Create your
                                <br />
                                Youth Hub
                                <br />
                                account.
                            </h1>

                            <p className="mt-6 max-w-md leading-7 text-green-100">
                                Register with SK Tagumpay Youth Hub to
                                participate in youth programs, activities,
                                services, and community initiatives.
                            </p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-8 sm:p-10 lg:p-12">
                        <div className="mb-8">
                            <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                                Registration
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                Create Account
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Enter your information to register.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        value={form.firstName}
                                        onChange={(event) =>
                                            updateField(
                                                "firstName",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                        placeholder="First name"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Middle Name
                                    </label>

                                    <input
                                        type="text"
                                        value={form.middleName}
                                        onChange={(event) =>
                                            updateField(
                                                "middleName",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                        placeholder="Middle name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={form.lastName}
                                    onChange={(event) =>
                                        updateField(
                                            "lastName",
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                    placeholder="Last name"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(event) =>
                                        updateField(
                                            "email",
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={(event) =>
                                        updateField(
                                            "password",
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                    placeholder="At least 6 characters"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    required
                                    value={form.confirmPassword}
                                    onChange={(event) =>
                                        updateField(
                                            "confirmPassword",
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                                    placeholder="Repeat your password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-green-800 px-4 py-3 font-bold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            Already have an account?{" "}

                            <Link
                                href="/auth/login"
                                className="font-semibold text-green-800 hover:text-green-900"
                            >
                                Log in here →
                            </Link>
                        </div>

                        <div className="mt-5 text-center">
                            <Link
                                href="/"
                                className="text-sm font-medium text-slate-500 hover:text-green-800"
                            >
                                ← Back to SK Tagumpay Youth Hub
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}