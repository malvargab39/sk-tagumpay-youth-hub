import { NextResponse } from "next/server";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../../../generated/prisma/client";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

const adapter = new PrismaMariaDb({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "sk_tagumpay",
    connectionLimit: 5,
});

const prisma = new PrismaClient({
    adapter,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const email = String(body.email || "")
            .trim()
            .toLowerCase();

        const password = String(body.password || "");

        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (!email || !password) {
            return NextResponse.json(
                {
                    error: "Email and password are required.",
                },
                { status: 400 }
            );
        }

        // --------------------------------
        // FIND USER
        // --------------------------------

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                youthprofile: true,
                officialprofile: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: "Invalid email or password.",
                },
                { status: 401 }
            );
        }

        // --------------------------------
        // CHECK PASSWORD
        // --------------------------------

        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            return NextResponse.json(
                {
                    error: "Invalid email or password.",
                },
                { status: 401 }
            );
        }

        // --------------------------------
        // CHECK ACCOUNT STATUS
        // --------------------------------

        if (user.status !== "ACTIVE") {
            return NextResponse.json(
                {
                    error: "Your account is inactive.",
                },
                { status: 403 }
            );
        }

        // --------------------------------
        // CHECK YOUTH PROFILE
        // --------------------------------

        if (user.role === "YOUTH" && !user.youthprofile) {
            return NextResponse.json(
                {
                    error:
                        "Your account does not have a youth profile. Please contact the SK administrator.",
                },
                { status: 403 }
            );
        }

        // --------------------------------
        // CREATE SESSION
        // --------------------------------

        const sessionToken = await createSession({
            userId: user.id,
            role: user.role,
        });

        // --------------------------------
        // DETERMINE REDIRECT
        // --------------------------------

        let redirectTo = "/dashboard";

        if (user.role === "ADMIN") {
            redirectTo = "/admin";
        } else if (user.role === "OFFICIAL") {
            redirectTo = "/admin";
        } else if (user.role === "YOUTH") {
            redirectTo = "/youth";
        }

        // --------------------------------
        // RESPONSE
        // --------------------------------

        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
            redirectTo,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });

        // --------------------------------
        // SESSION COOKIE
        // --------------------------------

        response.cookies.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            {
                error: "Unable to log in. Please try again.",
            },
            { status: 500 }
        );
    }
}