import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
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

        const users = await pool.query(
            `
            SELECT
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
            ORDER BY
                CASE
                    WHEN $1::text IS NOT NULL AND "userID"::text = $1 THEN 0
                    WHEN $2::text IS NOT NULL AND LOWER(role) = LOWER($2) THEN 1
                    ELSE 2
                END ASC,
                team ASC,
                CASE
                    WHEN "isExec" = TRUE THEN 0
                    WHEN "isLead" = TRUE THEN 1
                    ELSE 2
                END ASC,
                role ASC;
            `,
            [currentUserId, currentUserRole]
        );

        const res = await pool.query(`
            SELECT
                current_database() AS db,
                current_user AS usr,
                current_schema() AS schema,
                inet_server_addr() AS host,
                inet_server_port() AS port,
                COUNT(*) AS users
            FROM users;
        `);

        console.log("DATABASE CONNECTION:", res.rows[0]);

        return NextResponse.json(
            { users: users.rows },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error);

        return NextResponse.json(
            { error: "Failed to fetch users." },
            { status: 500 }
        );
    }
}