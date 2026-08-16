"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type YouthProfile = {
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    birthDate: string | null;
    sex: string | null;
    phoneNumber: string | null;
    address: string | null;
    user: {
        id: number;
        email: string;
        role: string;
        status: string;
    };
};

export default function YouthProfilePage() {
    const router = useRouter();

    const [profile, setProfile] =
        useState<YouthProfile | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        birthDate: "",
        sex: "",
        phoneNumber: "",
        address: "",
    });

    async function loadProfile() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "/api/youth/profile",
                {
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/auth/login");
                    return;
                }

                throw new Error(
                    data.error ||
                    "Unable to load your profile."
                );
            }

            const youth: YouthProfile = data.youth;

            setProfile(youth);

            setForm({
                firstName: youth.firstName || "",
                middleName: youth.middleName || "",
                lastName: youth.lastName || "",
                birthDate: youth.birthDate
                    ? youth.birthDate.substring(0, 10)
                    : "",
                sex: youth.sex || "",
                phoneNumber: youth.phoneNumber || "",
                address: youth.address || "",
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load your profile."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
    }, []);

    function updateField(
        field: keyof typeof form,
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function startEditing() {
        setError("");
        setSuccess("");
        setEditing(true);
    }

    function cancelEditing() {
        if (profile) {
            setForm({
                firstName: profile.firstName || "",
                middleName: profile.middleName || "",
                lastName: profile.lastName || "",
                birthDate: profile.birthDate
                    ? profile.birthDate.substring(0, 10)
                    : "",
                sex: profile.sex || "",
                phoneNumber: profile.phoneNumber || "",
                address: profile.address || "",
            });
        }

        setError("");
        setSuccess("");
        setEditing(false);
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.firstName.trim()) {
            setError("First name is required.");
            return;
        }

        if (!form.lastName.trim()) {
            setError("Last name is required.");
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                "/api/youth/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: form.firstName.trim(),
                        middleName:
                            form.middleName.trim() || null,
                        lastName: form.lastName.trim(),
                        birthDate:
                            form.birthDate || null,
                        sex: form.sex || null,
                        phoneNumber:
                            form.phoneNumber.trim() || null,
                        address:
                            form.address.trim() || null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Unable to update your profile."
                );
            }

            setProfile(data.youth);

            setForm({
                firstName:
                    data.youth.firstName || "",
                middleName:
                    data.youth.middleName || "",
                lastName:
                    data.youth.lastName || "",
                birthDate: data.youth.birthDate
                    ? data.youth.birthDate.substring(0, 10)
                    : "",
                sex: data.youth.sex || "",
                phoneNumber:
                    data.youth.phoneNumber || "",
                address:
                    data.youth.address || "",
            });

            setEditing(false);

            setSuccess(
                "Your profile has been updated successfully."
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    }

    function formatDate(date: string | null) {
        if (!date) {
            return "Not provided";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "Not provided";
        }

        return parsed.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                            Loading your profile...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                        <h1 className="text-xl font-extrabold text-red-800">
                            Profile unavailable
                        </h1>

                        <p className="mt-2 text-sm text-red-700">
                            {error ||
                                "Unable to load your profile."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
                    <a
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
                    </a>

                    <span className="text-xs font-bold uppercase tracking-wider text-green-700">
                        Youth
                    </span>
                </div>
            </header>

            <nav className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl gap-7 overflow-x-auto px-5 sm:px-8">
                    <a
                        href="/dashboard"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 hover:text-green-700"
                    >
                        Dashboard
                    </a>

                    <a
                        href="/youth"
                        className="whitespace-nowrap border-b-2 border-green-700 py-4 text-sm font-bold text-green-700"
                    >
                        My Profile
                    </a>

                    <a
                        href="/programs"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 hover:text-green-700"
                    >
                        Programs
                    </a>

                    <a
                        href="/events"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 hover:text-green-700"
                    >
                        Events
                    </a>

                    <a
                        href="/registrations"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 hover:text-green-700"
                    >
                        My Registrations
                    </a>

                    <a
                        href="/announcements"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 hover:text-green-700"
                    >
                        Announcements
                    </a>

                    <a
                        href="/certificates"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 hover:text-green-700"
                    >
                        Certificates
                    </a>
                </div>
            </nav>

            <section className="border-b border-green-100 bg-white">
                <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-700">
                        My Account
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-600">
                        View and manage your personal information.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800">
                        {success}
                    </div>
                )}

                {!editing ? (
                    <>
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl font-extrabold text-green-800">
                                        {profile.firstName
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-extrabold text-slate-900">
                                            {profile.firstName}{" "}
                                            {profile.middleName
                                                ? `${profile.middleName} `
                                                : ""}
                                            {profile.lastName}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {profile.user.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={startEditing}
                                    className="rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-xl font-extrabold text-slate-900">
                                Account Information
                            </h2>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Email
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-700">
                                        {profile.user.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Account Status
                                    </p>

                                    <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                                        {profile.user.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-xl font-extrabold text-slate-900">
                                Personal Information
                            </h2>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        First Name
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-700">
                                        {profile.firstName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Middle Name
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-700">
                                        {profile.middleName ||
                                            "Not provided"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Last Name
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-700">
                                        {profile.lastName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Birth Date
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-700">
                                        {formatDate(
                                            profile.birthDate
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Sex
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-700">
                                        {profile.sex ||
                                            "Not provided"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Phone Number
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-700">
                                        {profile.phoneNumber ||
                                            "Not provided"}
                                    </p>
                                </div>

                                <div className="sm:col-span-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Address
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-700">
                                        {profile.address ||
                                            "Not provided"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="border-b border-slate-100 pb-5">
                            <h2 className="text-xl font-extrabold text-slate-900">
                                Edit Profile
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Update your personal information below.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-6"
                        >
                            <div className="grid gap-6 sm:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="text-sm font-bold text-slate-700"
                                    >
                                        First Name
                                    </label>

                                    <input
                                        id="firstName"
                                        type="text"
                                        value={form.firstName}
                                        onChange={(event) =>
                                            updateField(
                                                "firstName",
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="middleName"
                                        className="text-sm font-bold text-slate-700"
                                    >
                                        Middle Name
                                    </label>

                                    <input
                                        id="middleName"
                                        type="text"
                                        value={form.middleName}
                                        onChange={(event) =>
                                            updateField(
                                                "middleName",
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="text-sm font-bold text-slate-700"
                                    >
                                        Last Name
                                    </label>

                                    <input
                                        id="lastName"
                                        type="text"
                                        value={form.lastName}
                                        onChange={(event) =>
                                            updateField(
                                                "lastName",
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="birthDate"
                                        className="text-sm font-bold text-slate-700"
                                    >
                                        Birth Date
                                    </label>

                                    <input
                                        id="birthDate"
                                        type="date"
                                        value={form.birthDate}
                                        onChange={(event) =>
                                            updateField(
                                                "birthDate",
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="sex"
                                        className="text-sm font-bold text-slate-700"
                                    >
                                        Sex
                                    </label>

                                    <select
                                        id="sex"
                                        value={form.sex}
                                        onChange={(event) =>
                                            updateField(
                                                "sex",
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    >
                                        <option value="">
                                            Select
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="phoneNumber"
                                        className="text-sm font-bold text-slate-700"
                                    >
                                        Phone Number
                                    </label>

                                    <input
                                        id="phoneNumber"
                                        type="tel"
                                        value={form.phoneNumber}
                                        onChange={(event) =>
                                            updateField(
                                                "phoneNumber",
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="text-sm font-bold text-slate-700"
                                >
                                    Address
                                </label>

                                <textarea
                                    id="address"
                                    rows={4}
                                    value={form.address}
                                    onChange={(event) =>
                                        updateField(
                                            "address",
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </section>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-5 py-6 text-center text-xs text-slate-500 sm:px-8">
                    © 2026 SK Tagumpay Youth Hub
                </div>
            </footer>
        </main>
    );
}