import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;

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
                "isExec" DESC,
                "isLead" DESC,
                name ASC`,
            [teamId]
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