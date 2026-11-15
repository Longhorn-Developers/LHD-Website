
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";

// GET: Validate reset token
// GET: Validate reset token
export async function GET(req: NextRequest) {
    try {
        const resetToken = req.nextUrl.searchParams.get("resetToken");

        if (!resetToken) {
            return NextResponse.json(
                { msg: "Reset token is required." },
                { status: 400 }
            );
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const result = await pool.query(
            `SELECT id
             FROM users
             WHERE reset_token = $1
             AND reset_token_expires > NOW()`,
            [hashedToken]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { msg: "Invalid or expired reset token." },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: "Reset token is valid."
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { msg: "Something went wrong." },
            { status: 500 }
        );
    }
}


// POST: Update password
export async function POST(req: NextRequest) {
    const client = await pool.connect();

    try {
        const { resetToken, password, confirmPassword } = await req.json();

        console.log(resetToken);
        console.log(password);
        console.log(confirmPassword);

        if (!resetToken || !password || !confirmPassword) {
            return NextResponse.json(
                { msg: "All fields are required." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { msg: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { msg: "Passwords do not match." },
                { status: 400 }
            );
        }

        await client.query("BEGIN");

        // Verify and lock reset token
       const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const tokenResult = await client.query(
            `SELECT id AS user_id
            FROM users
            WHERE reset_token = $1
            AND reset_token_expires > NOW()
            FOR UPDATE`,
            [hashedToken]
        );

        if (tokenResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return NextResponse.json(
                { msg: "Invalid or expired reset token." },
                { status: 400 }
            );
        }

        const userId = tokenResult.rows[0].user_id;

        // Update password
        await client.query(
            `UPDATE users
             SET password = $1
             WHERE id = $2`,
            [password, userId]
        );

        // Invalidate reset token
        await client.query(
            `UPDATE users
            SET reset_token = NULL,
                reset_token_expires = NULL
            WHERE id = $1`,
            [userId]
        );

        await client.query("COMMIT");

        return NextResponse.json({
            message: "Password successfully reset."
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Password reset error:", error);

        return NextResponse.json(
            { msg: "Internal server error." },
            { status: 500 }
        );

    } finally {
        client.release();
    }
}
