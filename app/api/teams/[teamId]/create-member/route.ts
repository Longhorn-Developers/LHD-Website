import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import {
    activeMembershipCondition,
    memberSelectFields,
    resolveTeam,
} from "@/lib/teamDb";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string }> }
) {
    const client = await pool.connect();
    let transactionStarted = false;

    try {
        const { teamId } = await params;
        const token = request.cookies.get("admin_token")?.value;
        const decoded = token ? await verifyToken(token) : null;
        if (!decoded || typeof decoded.adminId !== "number") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const team = await resolveTeam(client, teamId);
        if (!team) {
            return NextResponse.json(
                { message: "Team not found." },
                { status: 404 }
            );
        }

        const {
            name,
            email,
            role,
            isLead,
            isExec,
            execRole,
            githubID,
            discordID,
            status,
        } = await request.json();

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            typeof role !== "string" ||
            !role.trim() ||
            typeof isLead !== "boolean" ||
            typeof isExec !== "boolean" ||
            (execRole !== null && execRole !== undefined &&
                typeof execRole !== "string") ||
            (isExec && !execRole?.trim())
        ) {
            return NextResponse.json(
                { message: "Name, email, role, and valid permissions are required." },
                { status: 400 }
            );
        }

        await client.query("BEGIN");
        transactionStarted = true;

        const actorResult = await client.query(
            `SELECT
                u."isExec",
                tm.role,
                tm.islead AS "isLead"
             FROM users u
             LEFT JOIN team_members tm
               ON tm.user_id = u.id
              AND tm.team_id = $2
              AND ${activeMembershipCondition}
             WHERE u.id = $1
             ORDER BY tm.islead DESC
             LIMIT 1`,
            [decoded.adminId, team.id]
        );
        const actor = actorResult.rows[0];
        if (!actor) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const isExecActor = actor.isExec === true;
        const isAuthorizedLead =
            actor.isLead === true &&
            isLead === false &&
            isExec === false &&
            role.trim() === actor.role;
        if (!isExecActor && !isAuthorizedLead) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "You are not authorized to create this member." },
                { status: 403 }
            );
        }

        const existingUser = await client.query(
            `SELECT 1 FROM users WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );
        if (existingUser.rows.length > 0) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "Email already exists." },
                { status: 409 }
            );
        }

        const userID = randomUUID();
        const memberID = randomUUID();
        const password = randomUUID();
        const normalizedStatus =
            typeof status === "string" && status.trim()
                ? status.trim()
                : "active";
        const normalizedGithubID =
            typeof githubID === "string" ? githubID.trim() || null : null;
        const normalizedDiscordID =
            typeof discordID === "string" ? discordID.trim() || null : null;
        const normalizedExecRole =
            isExec && typeof execRole === "string"
                ? execRole.trim() || null
                : null;

        const userResult = await client.query(
            `INSERT INTO users (
                name, "userID", "memberID", email, password, team, role,
                "isLead", "isExec", "execRole", "githubID", "discordID",
                status, "createdAt"
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, $8, $9, $10, $11, $12, NOW())
             RETURNING id, "memberID"`,
            [
                name.trim(),
                userID,
                memberID,
                email.trim().toLowerCase(),
                password,
                team.name,
                role.trim(),
                isExec,
                normalizedExecRole,
                normalizedGithubID,
                normalizedDiscordID,
                normalizedStatus,
            ]
        );
        const newUser = userResult.rows[0];

        const membershipResult = await client.query(
            `INSERT INTO team_members (
                user_id, team_id, role, islead, memberid, status, datejoined
             )
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING id`,
            [
                newUser.id,
                team.id,
                role.trim(),
                isLead,
                newUser.memberID,
                normalizedStatus,
            ]
        );

        const memberResult = await client.query(
            `SELECT ${memberSelectFields}
             FROM team_members tm
             JOIN users u ON u.id = tm.user_id
             JOIN teams t ON t.id = tm.team_id
             WHERE tm.id = $1`,
            [membershipResult.rows[0].id]
        );

        await client.query("COMMIT");
        transactionStarted = false;

        return NextResponse.json(
            {
                message: "Member created successfully.",
                member: memberResult.rows[0],
            },
            { status: 201 }
        );
    } catch (error) {
        if (transactionStarted) {
            await client.query("ROLLBACK");
        }
        console.error("Create member error:", error);

        return NextResponse.json(
            { message: "Failed to create member." },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
