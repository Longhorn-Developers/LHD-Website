import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const users = await pool.query(`
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
                team ASC,
                CASE
                    WHEN "isExec" = TRUE THEN 0
                    WHEN "isLead" = TRUE THEN 1
                    ELSE 2
                END ASC,
                role ASC;
        `);

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