import "server-only";

import { SignJWT, jwtVerify } from "jose";

const secret = process.env.SESSION_SECRET;

if (!secret) {
    throw new Error("SESSION_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

export type SessionPayload = {
    userId: number;
    role: "YOUTH" | "OFFICIAL" | "ADMIN";
};

export async function createSession(payload: SessionPayload) {
    return new SignJWT({
        userId: payload.userId,
        role: payload.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secretKey);
}

export async function verifySession(token: string) {
    try {
        const { payload } = await jwtVerify(token, secretKey);

        if (
            typeof payload.userId !== "number" ||
            typeof payload.role !== "string"
        ) {
            return null;
        }

        return {
            userId: payload.userId,
            role: payload.role as SessionPayload["role"],
        };
    } catch {
        return null;
    }
}