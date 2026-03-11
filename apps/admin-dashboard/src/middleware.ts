import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-suuuuuper-secret-jwt-key-for-dev-only"
);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && request.nextUrl.pathname.startsWith("/dashboard")) {
        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (e) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
