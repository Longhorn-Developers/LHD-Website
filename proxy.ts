
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const token = request.cookies.get("admin_token")?.value;
    const payload = token ? await verifyToken(token) : null;

    const isAuthenticated =
        payload && typeof payload.adminId === "number";

    const publicRoutes = [
        "/admin-portal/admin-login",
        "/admin-portal/forgot-password",
        "/admin-portal/reset-password",
    ];

    // Public routes
    const isPublicRoute = publicRoutes.some(
        route =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    if (isPublicRoute) {
        if (isAuthenticated) {
            return NextResponse.redirect(
                new URL("/admin-portal", request.url)
            );
        }

        return NextResponse.next();
    }

    // Authenticated users cannot access other /admin/* routes
    // Excludes /admin-portal
    if (pathname.startsWith("/admin/") && isAuthenticated) {
        return NextResponse.redirect(
            new URL("/admin-portal", request.url)
        );
    }

    // Protect admin portal
    if (
        !isAuthenticated &&
        (pathname.startsWith("/admin-portal") && !publicRoutes.includes(pathname))
    ) {
        return NextResponse.redirect(
            new URL("/admin-portal/admin-login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin-login",
        "/admin-portal/:path*",
        "/admin/:path*",
    ],
};
