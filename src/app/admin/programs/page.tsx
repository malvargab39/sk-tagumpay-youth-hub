"use client";

import { useEffect, useState } from "react";

type Program = {
    id: number;
    name: string;
    description: string | null;
    status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
};

const statusOptions = [
    "PLANNED",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
] as const;

export default function AdminProgramsPage() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] =
        useState<Program["status"]>("PLANNED");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    async function loadPrograms() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/programs", {
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load programs."
                );
            }

            setPrograms(data.programs || []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load programs."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPrograms();
    }, []);

    function resetForm() {
        setEditingId(null);
        setName("");
        setDescription("");
        setStatus("PLANNED");
        setStartDate("");
        setEndDate("");
    }

    function editProgram(program: Program) {
        setEditingId(program.id);
        setName(program.name);
        setDescription(program.description || "");
        setStatus(program.status);

        setStartDate(
            program.startDate
                ? new Date(program.startDate)
                    .toISOString()
                    .slice(0, 16)
                : ""
        );

        setEndDate(
            program.endDate
                ? new Date(program.endDate)
                    .toISOString()
                    .slice(0, 16)
                : ""
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Program name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await fetch("/api/programs", {
                method: editingId ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: editingId,
                    name: name.trim(),
                    description: description.trim() || null,
                    status,
                    startDate: startDate || null,
                    endDate: endDate || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to save program."
                );
            }

            resetForm();
            await loadPrograms();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save program."
            );
        } finally {
            setSaving(false);
        }
    }

    async function deleteProgram(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this program?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch("/api/programs", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to delete program."
                );
            }

            if (editingId === id) {
                resetForm();
            }

            await loadPrograms();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete program."
            );
        }
    }

    function formatDate(date: string | null) {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function statusStyle(programStatus: Program["status"]) {
        switch (programStatus) {
            case "ONGOING":
                return "bg-green-100 text-green-800";

            case "COMPLETED":
                return "bg-slate-100 text-slate-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-800";
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            {/* Page Header */}
            <section className="border-b border-green-100 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-700">
                        Administration
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Programs
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-600">
                        Create and manage youth programs that will be
                        displayed on the Youth Hub.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {/* Create / Edit Program */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="border-b border-slate-100 pb-5">
                        <h2 className="text-xl font-extrabold text-slate-900">
                            {editingId
                                ? "Edit Program"
                                : "Create Program"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {editingId
                                ? "Update the selected youth program."
                                : "Add a new program to the SK Tagumpay Youth Hub."}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="text-sm font-bold text-slate-700"
                            >
                                Program Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Example: Youth Leadership Program"
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="text-sm font-bold text-slate-700"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Describe the program..."
                                rows={5}
                                className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
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
                                            e.target.value as Program["status"]
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                >
                                    {statusOptions.map((item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="startDate"
                                    className="text-sm font-bold text-slate-700"
                                >
                                    Start Date
                                </label>

                                <input
                                    id="startDate"
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="endDate"
                                    className="text-sm font-bold text-slate-700"
                                >
                                    End Date
                                </label>

                                <input
                                    id="endDate"
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Program"
                                        : "Create Program"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Program List */}
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 p-6 sm:p-8">
                        <h2 className="text-xl font-extrabold text-slate-900">
                            All Programs
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Programs currently stored in the system.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-sm text-slate-500">
                            Loading programs...
                        </div>
                    ) : programs.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                                📋
                            </div>

                            <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                                No programs yet
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Create your first youth program using
                                the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {programs.map((program) => (
                                <article
                                    key={program.id}
                                    className="p-6 sm:p-8"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-xl font-extrabold text-slate-900">
                                                    {program.name}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(
                                                        program.status
                                                    )}`}
                                                >
                                                    {program.status}
                                                </span>
                                            </div>

                                            {program.description && (
                                                <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">
                                                    {program.description}
                                                </p>
                                            )}

                                            <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                        Start Date
                                                    </p>

                                                    <p className="mt-1 font-semibold text-slate-700">
                                                        {formatDate(
                                                            program.startDate
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                        End Date
                                                    </p>

                                                    <p className="mt-1 font-semibold text-slate-700">
                                                        {formatDate(
                                                            program.endDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editProgram(program)
                                                }
                                                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-800"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteProgram(
                                                        program.id
                                                    )
                                                }
                                                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
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