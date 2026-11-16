
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function PUT(request: NextRequest) {
    try {
        const { name, email, githubID, discordID } = await request.json();

        // Validate required fields
        if (!name?.trim() || !email?.trim()) {
            return NextResponse.json(
                { message: "Name and email are required." },
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

        // Use the verified token identity instead of trusting a client-supplied user ID.
        const userResult = await pool.query(
            `SELECT "userID"
             FROM users
             WHERE id = $1`,
            [decoded.adminId]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        const user_ID = userResult.rows[0].userID;

        // Check whether email is already used by another account
        const existingUser = await pool.query(
            `SELECT "userID"
             FROM users
             WHERE LOWER(email) = LOWER($1)
             AND "userID" <> $2`,
            [email.trim(), user_ID]
        );

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { message: "Email is already in use." },
                { status: 409 }
            );
        }

        // Update profile
        const updateResult = await pool.query(
            `UPDATE users
             SET name = $1,
                 email = $2,
                 "githubID" = $3,
                 "discordID" = $4
             WHERE "userID" = $5
             RETURNING
                 id, name, "userID", email,
                 "githubID", "discordID"`,
            [
                name.trim(),
                email.trim(),
                githubID?.trim() || null,
                discordID?.trim() || null,
                user_ID
            ]
        );

        if (updateResult.rowCount === 0) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Profile updated successfully.",
            user: updateResult.rows[0]
        });

    } catch (error) {
        console.error("PROFILE UPDATE ERROR:", error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
