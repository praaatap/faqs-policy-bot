import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-suuuuuper-secret-jwt-key-for-dev-only"
);

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function signToken(payload: any): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}
