import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;
        let currentUserId: string | null = null;
        let currentUserRole: string | null = null;
        const token = request.cookies.get("admin_token")?.value;
        if (token) {
            const decoded = await verifyToken(token);
            if (typeof decoded?.adminId === "number") {
                const currentUser = await pool.query(
                    `SELECT "userID", role
                     FROM users
                     WHERE id = $1`,
                    [decoded.adminId]
                );
                currentUserId = currentUser.rows[0]?.userID ?? null;
                currentUserRole = currentUser.rows[0]?.role ?? null;
            }
        }

        const result = await pool.query(
            `SELECT
                name,
                "memberID",
                "userID",
                email,
                "githubID",
                "discordID",
                status,
                "dateJoined",
                "dateLeft",
                team,
                role,
                "isLead",
                "isExec",
                "execRole"
            FROM users
            WHERE team = $1
            ORDER BY
                CASE
                    WHEN $2::text IS NOT NULL AND "userID"::text = $2 THEN 0
                    WHEN $3::text IS NOT NULL AND LOWER(role) = LOWER($3) THEN 1
                    ELSE 2
                END ASC,
                "isExec" DESC,
                "isLead" DESC,
                name ASC`,
            [teamId, currentUserId, currentUserRole]
        );

        return NextResponse.json(
            { members: result.rows },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving team members:", error);

        return NextResponse.json(
            { error: "Failed to retrieve team members." },
            { status: 500 }
        );
    }
}