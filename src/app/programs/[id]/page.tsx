import Link from "next/link";

const programs = {
    "youth-development": {
        title: "Youth Development Program",
        category: "Youth Development",
        icon: "🌱",
        description:
            "Programs and activities designed to help young people develop skills, confidence, leadership, and community involvement.",
        details:
            "This program provides opportunities for young people to participate in activities focused on personal development, leadership, teamwork, and active participation in the community.",
    },

    "sports-recreation": {
        title: "Sports & Recreation",
        category: "Sports & Recreation",
        icon: "🏀",
        description:
            "Participate in sports, recreational activities, and community events that promote health, teamwork, and friendship.",
        details:
            "This program encourages youth participation in sports and recreational activities while promoting healthy lifestyles, teamwork, discipline, and community spirit.",
    },

    "education-skills": {
        title: "Education & Skills Training",
        category: "Education & Training",
        icon: "📚",
        description:
            "Discover educational activities, workshops, seminars, and skills development opportunities for the youth.",
        details:
            "This program provides learning opportunities, workshops, seminars, and skills training designed to help young people improve their knowledge and practical abilities.",
    },

    "community-engagement": {
        title: "Community Engagement",
        category: "Community",
        icon: "🤝",
        description:
            "Take part in community activities, volunteer opportunities, and projects that make a positive difference in Barangay Tagumpay.",
        details:
            "This program gives youth opportunities to participate in community projects, volunteer activities, and initiatives that contribute to the development of Barangay Tagumpay.",
    },
};

export default async function ProgramDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const program = programs[id as keyof typeof programs];

    if (!program) {
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
                    </div>
                </header>

                <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <h1 className="text-xl font-bold text-red-900">
                            Program Not Found
                        </h1>

                        <p className="mt-2 text-sm text-red-800">
                            The program you are looking for does not exist.
                        </p>

                        <Link
                            href="/programs"
                            className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
                        >
                            ← Back to Programs
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

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
                        href="/programs"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                        ← Programs
                    </Link>
                </div>
            </header>

            {/* Program Header */}
            <section className="border-b border-green-100 bg-white">
                <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
                        {program.icon}
                    </div>

                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-green-700">
                        {program.category}
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        {program.title}
                    </h1>

                    <p className="mt-4 max-w-3xl text-slate-600">
                        {program.description}
                    </p>
                </div>
            </section>

            {/* Program Details */}
            <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-extrabold text-slate-900">
                        About This Program
                    </h2>

                    <p className="mt-4 leading-7 text-slate-600">
                        {program.details}
                    </p>
                </div>

                {/* Registration */}
                <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-6 sm:p-8">
                    <h2 className="text-lg font-extrabold text-green-900">
                        Interested in this program?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-green-800">
                        Registration will be available once the program
                        registration system is connected to the database.
                    </p>

                    <button
                        type="button"
                        disabled
                        className="mt-5 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white opacity-50"
                    >
                        Registration Coming Soon
                    </button>
                </div>

                {/* Back */}
                <div className="mt-8">
                    <Link
                        href="/programs"
                        className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-green-300 hover:text-green-700"
                    >
                        ← Back to Programs
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-5 py-6 text-center text-xs text-slate-500">
                    © 2026 SK Tagumpay Youth Hub
                </div>
            </footer>
        </main>
    );
}