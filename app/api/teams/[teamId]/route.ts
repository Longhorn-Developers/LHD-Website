import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import {
    activeMembershipCondition,
    memberSelectFields,
    resolveTeam,
} from "@/lib/teamDb";
import type { PoolClient } from "pg";

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string }> }
) {
    const client: PoolClient = await pool.connect();
    let transactionStarted = false;

    try {
        const { teamId } = await params;
        if (!teamId) {
            return NextResponse.json(
                { error: "Team ID is required." },
                { status: 400 }
            );
        }

        const token = request.cookies.get("admin_token")?.value;
        const decoded = token ? await verifyToken(token) : null;
        if (!decoded || typeof decoded.adminId !== "number") {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        await client.query("BEGIN");
        transactionStarted = true;

        const actor = await client.query(
            `SELECT "isExec"
             FROM users
             WHERE id = $1
             FOR UPDATE`,
            [decoded.adminId]
        );
        if (actor.rows.length === 0) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }
        if (actor.rows[0].isExec !== true) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { error: "Only executives can remove teams." },
                { status: 403 }
            );
        }

        const team = await resolveTeam(client, teamId);
        if (!team) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { error: "Team not found." },
                { status: 404 }
            );
        }

        await client.query(
            `DELETE FROM team_members
             WHERE team_id = $1`,
            [team.id]
        );
        const result = await client.query(
            `DELETE FROM teams
             WHERE id = $1
             RETURNING id::text AS id, name`,
            [team.id]
        );
        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { error: "Team not found." },
                { status: 404 }
            );
        }

        await client.query("COMMIT");
        transactionStarted = false;
        return NextResponse.json(
            {
                message: "Team removed successfully.",
                team: result.rows[0],
            },
            { status: 200 }
        );
    } catch (error) {
        if (transactionStarted) {
            await client.query("ROLLBACK");
        }
        console.error("Error removing team:", error);
        return NextResponse.json(
            { error: "Failed to remove team." },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}