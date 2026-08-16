export default function StatisticsPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                    Reports
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    Statistics
                </h1>

                <p className="mt-2 text-slate-500">
                    View SK Tagumpay Youth Hub statistics and reports.
                </p>
            </div>

            {/* Statistics Cards */}
            <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Total Youth
                    </p>

                    <p className="mt-3 text-4xl font-bold text-slate-900">
                        0
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Registered youth members
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Total Officials
                    </p>

                    <p className="mt-3 text-4xl font-bold text-slate-900">
                        0
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Registered SK officials
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Announcements
                    </p>

                    <p className="mt-3 text-4xl font-bold text-slate-900">
                        0
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Published announcements
                    </p>
                </div>
            </section>

            {/* Report Section */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Reports Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        More statistics and reports will appear here as
                        your system grows.
                    </p>
                </div>

                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <p className="font-medium text-slate-700">
                        No report data available yet.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Statistics will be generated from your youth,
                        officials, announcements, and program records.
                    </p>
                </div>
            </section>
        </div>
    );
}