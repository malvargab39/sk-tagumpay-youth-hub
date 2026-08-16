"use client";

import { FormEvent, useState } from "react";

const announcements = [
  {
    title: "Youth General Assembly",
    date: "Coming Soon",
    description:
      "Stay tuned for the next youth general assembly and community updates.",
  },
  {
    title: "SK Programs & Activities",
    date: "2026",
    description:
      "Discover upcoming programs, activities, and opportunities for the youth.",
  },
  {
    title: "Have an Idea for the Community?",
    date: "Anytime",
    description:
      "Send your suggestions and help shape programs for the youth.",
  },
];

const services = [
  {
    title: "Youth Programs",
    description:
      "Explore programs designed to support youth development, skills, and participation.",
  },
  {
    title: "Events & Activities",
    description:
      "Stay updated with upcoming youth events, activities, and community gatherings.",
  },
  {
    title: "Suggestions",
    description:
      "Share your ideas and suggestions to help improve programs for the youth.",
  },
  {
    title: "Youth Services",
    description:
      "Access information about services, opportunities, and support available to youth.",
  },
];

const programs = [
  {
    title: "Youth Development",
    description:
      "Build skills, confidence, leadership, and opportunities through youth-focused activities.",
  },
  {
    title: "Sports & Recreation",
    description:
      "Participate in sports, recreation, wellness activities, and community events.",
  },
  {
    title: "Community Projects",
    description:
      "Get involved in projects that make a positive difference in Barangay Tagumpay.",
  },
];

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const openLogin = () => {
    setLoginError("");
    setShowLogin(true);
  };

  const closeLogin = () => {
    if (isLoggingIn) return;

    setShowLogin(false);
    setLoginError("");
  };

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(
          data.error ||
          data.message ||
          "Invalid email or password. Please check your credentials and try again."
        );
        return;
      }

      /*
       * IMPORTANT:
       * Your login API returns the account information
       * inside data.user.
       *
       * Therefore we use:
       *
       * data.user.role
       *
       * NOT:
       *
       * data.role
       */

      const role = data.user?.role;

      console.log("LOGIN SUCCESS:", data);
      console.log("USER ROLE:", role);

      if (role === "ADMIN") {
        window.location.href = "/admin";
        return;
      }

      if (role === "OFFICIAL") {
        window.location.href = "/admin";
        return;
      }

      if (role === "YOUTH") {
        window.location.href = "/youth";
        return;
      }

      setLoginError(
        "Login succeeded, but the account role could not be determined."
      );
    } catch (error) {
      console.error("Login error:", error);

      setLoginError(
        "Unable to connect to the server. Please make sure the application is running."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-green-700 shadow-sm">
              <img
                src="/sk-logo.png"
                alt="SK Tagumpay Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-extrabold text-slate-800 sm:text-base">
                SK Tagumpay
              </p>

              <p className="text-[9px] font-semibold tracking-[0.18em] text-slate-500">
                YOUTH HUB
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a
              href="#home"
              className="text-slate-700 transition hover:text-green-700"
            >
              Home
            </a>

            <a
              href="#programs"
              className="text-slate-700 transition hover:text-green-700"
            >
              Programs
            </a>

            <a
              href="#announcements"
              className="text-slate-700 transition hover:text-green-700"
            >
              Announcements
            </a>

            <a
              href="#services"
              className="text-slate-700 transition hover:text-green-700"
            >
              Youth Services
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openLogin}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Log In
            </button>

            <a
              href="/auth/register"
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-green-800"
            >
              Register
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative isolate overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-1/2 top-1/2 flex h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full opacity-[0.11]">
            <img
              src="/sk-logo.png"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-green-200/40 blur-3xl" />

          <div className="absolute -bottom-48 -left-40 h-[480px] w-[480px] rounded-full bg-green-200/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-green-600" />

                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-green-800 sm:text-xs">
                  Sangguniang Kabataan · Barangay Tagumpay
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Your voice.
                <br />
                Your community.
                <br />
                <span className="text-green-700">Your Youth Hub.</span>
              </h1>

              <div className="mt-6 max-w-xl">
                <p className="text-lg font-semibold text-slate-700">
                  Connect. Participate. Lead.
                </p>

                <p className="mt-2 text-base leading-7 text-slate-600">
                  Your online hub for youth programs, activities,
                  announcements, services, and community participation in
                  Barangay Tagumpay.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={openLogin}
                  className="rounded-xl bg-green-700 px-6 py-3 text-center text-sm font-bold text-white shadow-md shadow-green-900/10 transition hover:bg-green-800 hover:shadow-lg"
                >
                  Log In to Youth Hub
                </button>

                <a
                  href="#programs"
                  className="rounded-xl border border-green-300 bg-white/80 px-6 py-3 text-center text-sm font-bold text-green-800 shadow-sm backdrop-blur transition hover:border-green-500 hover:bg-green-50"
                >
                  Explore Programs
                </a>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-green-200 pt-6">
                <div>
                  <p className="text-2xl font-extrabold text-green-800">
                    Youth
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Community first
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-green-800">
                    2026
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Active programs
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-green-800">
                    SK
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Sangguniang Kabataan
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center">
              <div className="relative flex h-[280px] w-[280px] items-center justify-center rounded-full bg-white p-5 shadow-2xl shadow-green-900/10 ring-1 ring-green-100 sm:h-[340px] sm:w-[340px] lg:h-[390px] lg:w-[390px]">
                <div className="absolute inset-5 rounded-full bg-green-50" />

                <img
                  src="/sk-logo.png"
                  alt="Sangguniang Kabataan Barangay Tagumpay Logo"
                  className="relative z-10 h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
              Explore the Hub
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything youth needs, in one place.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Access programs, activities, announcements, suggestions, and
              youth services through the SK Tagumpay Youth Hub.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-100">
                  <span className="text-lg font-bold">✦</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
              Get Involved
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Programs & Activities
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Find opportunities to participate, develop your skills, and
              contribute to the community.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {programs.map((program) => (
              <article
                key={program.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
              >
                <div className="mb-5 h-1 w-12 rounded-full bg-green-700" />

                <h3 className="text-xl font-bold text-slate-900">
                  {program.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {program.description}
                </p>

                <a
                  href="#announcements"
                  className="mt-5 inline-block text-sm font-bold text-green-700 transition hover:text-green-800"
                >
                  Learn more →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section id="announcements" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
            Stay Informed
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Latest Announcements
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {announcements.map((announcement) => (
              <article
                key={announcement.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:border-green-200 hover:bg-green-50/40"
              >
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                  {announcement.date}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {announcement.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {announcement.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-green-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-7 rounded-3xl border border-green-100 bg-white p-8 shadow-sm md:flex-row md:items-center md:p-10">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
                Be Part of the Community
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Your voice can help shape our community.
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Join the SK Tagumpay Youth Hub and stay connected with
                programs, activities, services, and opportunities.
              </p>
            </div>

            <a
              href="/auth/register"
              className="shrink-0 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800"
            >
              Create an Account
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-green-700">
                  <img
                    src="/sk-logo.png"
                    alt="SK Tagumpay Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-bold text-white">
                    SK Tagumpay Youth Hub
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your youth, your voice, your community.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-400">
              <p>Barangay Tagumpay</p>
              <p className="mt-1">Sangguniang Kabataan</p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6 text-xs text-slate-500">
            © 2026 SK Tagumpay Youth Hub. All rights reserved.
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLogin();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* LOGIN HEADER */}
            <div className="bg-gradient-to-br from-green-700 to-green-800 px-7 pb-8 pt-7 text-white">
              <button
                type="button"
                onClick={closeLogin}
                disabled={isLoggingIn}
                aria-label="Close login"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-md">
                  <img
                    src="/sk-logo.png"
                    alt="SK Tagumpay Logo"
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-100">
                    SK Tagumpay
                  </p>

                  <h2
                    id="login-title"
                    className="mt-1 text-2xl font-extrabold"
                  >
                    Welcome Back
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-green-50">
                Log in to access the SK Tagumpay Youth Hub.
              </p>
            </div>

            {/* LOGIN FORM */}
            <div className="px-7 py-7">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                {loginError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingIn ? "Signing In..." : "Log In"}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?
                </p>

                <a
                  href="/auth/register"
                  className="mt-1 inline-block text-sm font-bold text-green-700 transition hover:text-green-800"
                >
                  Create an account
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}