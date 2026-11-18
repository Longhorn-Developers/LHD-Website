import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import {
    activeMembershipCondition,
    memberSelectFields,
    resolveTeam,
} from "@/lib/teamDb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;
        const team = await resolveTeam(pool, teamId);

        if (!team) {
            return NextResponse.json(
                { error: "Team not found." },
                { status: 404 }
            );
        }

        let currentUserId: string | null = null;
        const token = request.cookies.get("admin_token")?.value;
        if (token) {
            const decoded = await verifyToken(token);
            if (typeof decoded?.adminId === "number") {
                const currentUser = await pool.query(
                    `SELECT "userID"
                     FROM users
                     WHERE id = $1`,
                    [decoded.adminId]
                );
                currentUserId = currentUser.rows[0]?.userID ?? null;
            }
        }

        const result = await pool.query(
            `SELECT ${memberSelectFields}
             FROM team_members tm
             JOIN users u ON u.id = tm.user_id
             JOIN teams t ON t.id = tm.team_id
             WHERE tm.team_id = $1
               AND ${activeMembershipCondition}
             ORDER BY
                CASE WHEN $2::text IS NOT NULL AND u."userID"::text = $2
                     THEN 0 ELSE 1 END,
                u."isExec" DESC,
                tm.islead DESC,
                u.name ASC`,
            [team.id, currentUserId]
        );

        return NextResponse.json(
            { team, members: result.rows },
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
