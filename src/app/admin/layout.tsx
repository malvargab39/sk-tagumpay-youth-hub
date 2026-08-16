import Link from "next/link";
import AdminNavigation from "@/components/AdminNavigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            {/* Admin Header */}
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

            {/* ONE Admin Navigation */}
            <AdminNavigation />

            {/* Current Admin Page */}
            {children}

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-slate-500 sm:px-8">
                    © 2026 SK Tagumpay Youth Hub
                </div>
            </footer>
        </main>
    );
}