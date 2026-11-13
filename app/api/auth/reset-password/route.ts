import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { password, token } = await req.json();

        // Validate input
        if (!password || !token) {
            return NextResponse.json(
                { message: "Password and token are required." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        // Hash the received token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid reset token
        const user = await pool.query(
            `SELECT id FROM users
             WHERE reset_token = $1
             AND reset_token_expires > NOW()`,
            [hashedToken]
        );

        if (user.rows.length === 0) {
            return NextResponse.json(
                { message: "Invalid or expired reset link." },
                { status: 400 }
            );
        }

        // Update password and invalidate token
        await pool.query(
            `UPDATE users
             SET password = $1,
                 reset_token = NULL,
                 reset_token_expires = NULL
             WHERE id = $2`,
            [password, user.rows[0].id]
        );

        return NextResponse.json(
            { message: "Password successfully reset." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Reset password error:", error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}