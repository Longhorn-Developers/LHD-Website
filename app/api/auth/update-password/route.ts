
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function PUT(request: NextRequest) {
    try {
        const { currentPassword, newPassword } = await request.json();

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: "All password fields are required." },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { message: "New password must be at least 8 characters." },
                { status: 400 }
            );
        }

        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        const decoded = await verifyToken(token);

        if (!decoded || typeof decoded.adminId !== "number") {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        // Retrieve user's current password
        const userResult = await pool.query(
            `SELECT id, password
             FROM users
             WHERE id = $1`,
            [decoded.adminId]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        const user = userResult.rows[0];

        // Verify current password
        if (currentPassword !== user.password) {
            return NextResponse.json(
                { message: "Current password is incorrect." },
                { status: 401 }
            );
        }

        // Prevent reusing current password
        if (newPassword === currentPassword) {
            return NextResponse.json(
                { message: "New password must be different from your current password." },
                { status: 400 }
            );
        }

        // Update password
        await pool.query(
            `UPDATE users
             SET password = $1
             WHERE id = $2`,
            [newPassword, decoded.adminId]
        );

        return NextResponse.json({
            message: "Password updated successfully."
        });

    } catch (error) {
        console.error("PASSWORD UPDATE ERROR:", error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
