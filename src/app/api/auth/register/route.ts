import { NextResponse } from "next/server";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../../../generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const prisma = new PrismaClient({
    adapter,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const firstName = String(body.firstName ?? "").trim();
        const middleName = String(body.middleName ?? "").trim();
        const lastName = String(body.lastName ?? "").trim();
        const email = String(body.email ?? "").trim().toLowerCase();
        const password = String(body.password ?? "");

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { error: "Please complete all required fields." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters." },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // IMPORTANT:
        // Never store the plain-text password.
        // bcrypt creates the password hash that the login route checks.
        const passwordHash = await bcrypt.hash(password, 10);

        const now = new Date();

        // Create user and youth profile together
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: "YOUTH",
                status: "ACTIVE",
                createdAt: now,
                updatedAt: now,

                youthprofile: {
                    create: {
                        firstName,
                        middleName: middleName || null,
                        lastName,
                        createdAt: now,
                        updatedAt: now,
                    },
                },
            },

            select: {
                id: true,
                email: true,
                role: true,
                status: true,
            },
        });

        return NextResponse.json(
            {
                message: "Account created successfully.",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);

        return NextResponse.json(
            {
                error: "Unable to create account.",
            },
            { status: 500 }
        );
    }
}