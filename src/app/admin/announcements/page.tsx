"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AnnouncementStatus =
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";

type Announcement = {
    id: number;
    title: string;
    content: string;
    status: AnnouncementStatus;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

const statusOptions = [
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
] as const;

export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] =
        useState<Announcement[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [status, setStatus] =
        useState<AnnouncementStatus>("DRAFT");

    async function loadAnnouncements() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "/api/announcements",
                {
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to load announcements."
                );
            }

            setAnnouncements(
                data.announcements || []
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load announcements."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAnnouncements();
    }, []);

    function resetForm() {
        setEditingId(null);
        setTitle("");
        setContent("");
        setStatus("DRAFT");
    }

    function editAnnouncement(
        announcement: Announcement
    ) {
        setEditingId(announcement.id);
        setTitle(announcement.title);
        setContent(announcement.content);
        setStatus(announcement.status);

        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!title.trim()) {
            setError(
                "Announcement title is required."
            );
            return;
        }

        if (!content.trim()) {
            setError(
                "Announcement content is required."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                "/api/announcements",
                {
                    method: editingId
                        ? "PATCH"
                        : "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        id: editingId,
                        title: title.trim(),
                        content: content.trim(),
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to save announcement."
                );
            }

            setMessage(
                editingId
                    ? "Announcement updated successfully."
                    : "Announcement created successfully."
            );

            resetForm();

            await loadAnnouncements();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save announcement."
            );
        } finally {
            setSaving(false);
        }
    }

    async function deleteAnnouncement(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this announcement? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                "/api/announcements",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to delete announcement."
                );
            }

            if (editingId === id) {
                resetForm();
            }

            setMessage(
                "Announcement deleted successfully."
            );

            await loadAnnouncements();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete announcement."
            );
        }
    }

    function formatDate(date: string | null) {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-PH",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    }

    function formatDateTime(
        date: string | null
    ) {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            "en-PH",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    }

    function statusStyle(
        announcementStatus: AnnouncementStatus
    ) {
        switch (announcementStatus) {
            case "PUBLISHED":
                return "bg-green-100 text-green-800";

            case "ARCHIVED":
                return "bg-slate-100 text-slate-600";

            default:
                return "bg-yellow-100 text-yellow-800";
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            {/* HEADER */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
                    <Link
                        href="/admin"
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
                        Admin
                    </div>
                </div>
            </header>

            {/* ADMIN NAVIGATION */}
            <nav className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-5 sm:px-8">
                    <Link
                        href="/admin"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/youth"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Youth
                    </Link>

                    <Link
                        href="/admin/officials"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Officials
                    </Link>

                    <Link
                        href="/admin/programs"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Programs
                    </Link>

                    <Link
                        href="/admin/announcements"
                        className="whitespace-nowrap border-b-2 border-green-700 py-4 text-sm font-bold text-green-700"
                    >
                        Announcements
                    </Link>

                    <Link
                        href="/admin/statistics"
                        className="whitespace-nowrap py-4 text-sm font-semibold text-slate-500 transition hover:text-green-700"
                    >
                        Statistics
                    </Link>
                </div>
            </nav>

            {/* PAGE HEADER */}
            <section className="border-b border-green-100 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                        Administration
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Announcements
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        Create and manage announcements
                        for the SK Tagumpay Youth Hub.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {/* SUCCESS */}
                {message && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                        {message}
                    </div>
                )}

                {/* CREATE / EDIT */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900">
                                {editingId
                                    ? "Edit Announcement"
                                    : "Create Announcement"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingId
                                    ? "Update the selected announcement."
                                    : "Add a new announcement for the Youth Hub."}
                            </p>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-6"
                    >
                        {/* TITLE */}
                        <div>
                            <label
                                htmlFor="title"
                                className="text-sm font-bold text-slate-700"
                            >
                                Announcement Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Youth Leadership Program"
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        {/* CONTENT */}
                        <div>
                            <label
                                htmlFor="content"
                                className="text-sm font-bold text-slate-700"
                            >
                                Content
                            </label>

                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) =>
                                    setContent(
                                        e.target.value
                                    )
                                }
                                rows={7}
                                placeholder="Write your announcement here..."
                                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        {/* STATUS */}
                        <div>
                            <label
                                htmlFor="status"
                                className="text-sm font-bold text-slate-700"
                            >
                                Status
                            </label>

                            <select
                                id="status"
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target
                                            .value as AnnouncementStatus
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:w-72"
                            >
                                {statusOptions.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Announcement"
                                        : "Create Announcement"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={
                                        resetForm
                                    }
                                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* ALL ANNOUNCEMENTS */}
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 p-6 sm:p-8">
                        <h2 className="text-xl font-extrabold text-slate-900">
                            All Announcements
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Announcements currently stored
                            in the system.
                        </p>
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="p-10 text-center text-sm text-slate-500">
                            Loading announcements...
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading &&
                        announcements.length === 0 && (
                            <div className="p-10 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                                    📢
                                </div>

                                <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                                    No announcements yet
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Create your first
                                    announcement using
                                    the form above.
                                </p>
                            </div>
                        )}

                    {/* ANNOUNCEMENT LIST */}
                    {!loading &&
                        announcements.length > 0 && (
                            <div className="divide-y divide-slate-100">
                                {announcements.map(
                                    (
                                        announcement
                                    ) => (
                                        <article
                                            key={
                                                announcement.id
                                            }
                                            className="p-6 sm:p-8"
                                        >
                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                                {/* INFO */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(
                                                                announcement.status
                                                            )}`}
                                                        >
                                                            {
                                                                announcement.status
                                                            }
                                                        </span>

                                                        <span className="text-xs font-semibold text-slate-400">
                                                            #
                                                            {
                                                                announcement.id
                                                            }
                                                        </span>
                                                    </div>

                                                    <h3 className="mt-3 text-xl font-extrabold text-slate-900">
                                                        {
                                                            announcement.title
                                                        }
                                                    </h3>

                                                    <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600">
                                                        {
                                                            announcement.content
                                                        }
                                                    </p>

                                                    <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                Created
                                                            </p>

                                                            <p className="mt-1 font-semibold text-slate-700">
                                                                {formatDate(
                                                                    announcement.createdAt
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                Published
                                                            </p>

                                                            <p className="mt-1 font-semibold text-slate-700">
                                                                {formatDateTime(
                                                                    announcement.publishedAt
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ACTIONS */}
                                                <div className="flex shrink-0 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            editAnnouncement(
                                                                announcement
                                                            )
                                                        }
                                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-800"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteAnnouncement(
                                                                announcement.id
                                                            )
                                                        }
                                                        className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                )}
                            </div>
                        )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-slate-500 sm:px-8">
                    © 2026 SK Tagumpay Youth Hub
                </div>
            </footer>
        </main>
    );
}