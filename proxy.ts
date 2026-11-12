import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("admin_token")?.value;

    const payload = token ? await verifyToken(token) : null;

    const isLoginPage = request.nextUrl.pathname === "/admin-login";

    // Not authenticated
    if (!payload || typeof payload.adminId !== "number") {
        if (isLoginPage) {
            return NextResponse.next();
        }

        return NextResponse.redirect(
            new URL("/admin-login", request.url)
        );
    }

    // Already authenticated
    if (isLoginPage) {
        return NextResponse.redirect(
            new URL("/admin-portal", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin-login", "/admin-portal/:path*"],
};