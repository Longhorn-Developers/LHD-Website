import { NextRequest, NextResponse } from "next/server";
import type { PoolClient } from "pg";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import {
    activeMembershipCondition,
    memberSelectFields,
    resolveTeam,
} from "@/lib/teamDb";

type RouteParams = {
    params: Promise<{ teamId: string; memberId: string }>;
};

async function getActor(
    client: PoolClient,
    adminId: number,
    teamId: string
) {
    const result = await client.query(
        `SELECT u."userID", u."isExec", tm.role, tm.islead AS "isLead"
         FROM users u
         LEFT JOIN team_members tm
           ON tm.user_id = u.id
          AND tm.team_id = $2
          AND ${activeMembershipCondition}
         WHERE u.id = $1
         ORDER BY tm.islead DESC
         LIMIT 1`,
        [adminId, teamId]
    );
    return result.rows[0] ?? null;
}

async function getMember(
    client: PoolClient,
    teamId: string,
    userID: string,
    lock = false
) {
    const result = await client.query(
        `SELECT u.id, u."userID", u."memberID", u."isExec", u."execRole",
                tm.id AS "membershipID", tm.role, tm.islead AS "isLead"
         FROM team_members tm
         JOIN users u ON u.id = tm.user_id
         WHERE tm.team_id = $1
           AND u."userID" = $2
           AND ${activeMembershipCondition}
         ORDER BY tm.datejoined DESC NULLS LAST, tm.id DESC
         LIMIT 1${lock ? " FOR UPDATE OF tm, u" : ""}`,
        [teamId, userID]
    );
    return result.rows[0] ?? null;
}

async function authorize(
    request: NextRequest,
    client: PoolClient,
    teamId: string
) {
    const token = request.cookies.get("admin_token")?.value;
    const decoded = token ? await verifyToken(token) : null;
    if (!decoded || typeof decoded.adminId !== "number") {
        return { error: "Unauthorized", status: 401 as const };
    }

    const actor = await getActor(client, decoded.adminId, teamId);
    if (!actor) {
        return { error: "Unauthorized", status: 401 as const };
    }

    return { actor, error: null, status: null };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    const client = await pool.connect();
    let transactionStarted = false;

    try {
        const { teamId, memberId } = await params;
        if (!teamId || !memberId) {
            return NextResponse.json(
                { message: "Team ID and Member ID missing" },
                { status: 400 }
            );
        }

        const team = await resolveTeam(client, teamId);
        if (!team) {
            return NextResponse.json(
                { message: "Team not found." },
                { status: 404 }
            );
        }
        const authorization = await authorize(request, client, team.id);
        if (!authorization.actor) {
            return NextResponse.json(
                { message: authorization.error },
                { status: authorization.status ?? 401 }
            );
        }

        const { role, isLead, isExec, execRole } = await request.json();
        if (
            typeof role !== "string" ||
            !role.trim() ||
            typeof isLead !== "boolean" ||
            typeof isExec !== "boolean" ||
            (execRole !== null && execRole !== undefined &&
                typeof execRole !== "string") ||
            (isExec && !execRole?.trim())
        ) {
            return NextResponse.json(
                { message: "Invalid member details." },
                { status: 400 }
            );
        }

        await client.query("BEGIN");
        transactionStarted = true;

        const targetResult = await client.query(
            `SELECT id, "userID", "memberID", "isExec"
             FROM users
             WHERE "userID" = $1
             FOR UPDATE`,
            [memberId]
        );
        const targetUser = targetResult.rows[0];
        if (!targetUser) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "Member not found." },
                { status: 404 }
            );
        }

        const actor = authorization.actor;
        const isExecActor = actor.isExec === true;
        const isAuthorizedLead =
            actor.isLead === true &&
            isLead === false &&
            isExec === false &&
            role.trim() === actor.role &&
            targetUser.isExec !== true;
        if (!isExecActor && !isAuthorizedLead) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "You are not authorized to add this member." },
                { status: 403 }
            );
        }

        const normalizedExecRole =
            isExec && typeof execRole === "string"
                ? execRole.trim() || null
                : null;
        await client.query(
            `UPDATE users
             SET "isExec" = $1, "execRole" = $2
             WHERE id = $3`,
            [isExec, normalizedExecRole, targetUser.id]
        );

        const previousMembership = await client.query(
            `SELECT id
             FROM team_members
             WHERE user_id = $1 AND team_id = $2
             ORDER BY dateleft NULLS FIRST, datejoined DESC NULLS LAST, id DESC
             LIMIT 1
             FOR UPDATE`,
            [targetUser.id, team.id]
        );
        let membershipId: number | string;
        if (previousMembership.rows.length > 0) {
            const updated = await client.query(
                `UPDATE team_members
                 SET role = $1,
                     islead = $2,
                     status = 'active',
                     datejoined = COALESCE(datejoined, NOW()),
                     dateleft = NULL
                 WHERE id = $3
                 RETURNING id`,
                [role.trim(), isLead, previousMembership.rows[0].id]
            );
            membershipId = updated.rows[0].id;
        } else {
            const inserted = await client.query(
                `INSERT INTO team_members (
                    user_id, team_id, role, islead, memberid, status, datejoined
                 )
                 VALUES ($1, $2, $3, $4, $5, 'active', NOW())
                 RETURNING id`,
                [
                    targetUser.id,
                    team.id,
                    role.trim(),
                    isLead,
                    targetUser.memberID,
                ]
            );
            membershipId = inserted.rows[0].id;
        }

        const memberResult = await client.query(
            `SELECT ${memberSelectFields}
             FROM team_members tm
             JOIN users u ON u.id = tm.user_id
             JOIN teams t ON t.id = tm.team_id
             WHERE tm.id = $1`,
            [membershipId]
        );

        await client.query("COMMIT");
        transactionStarted = false;
        return NextResponse.json(
            {
                message: "Member successfully added to team",
                member: memberResult.rows[0],
            },
            { status: 200 }
        );
    } catch (error) {
        if (transactionStarted) {
            await client.query("ROLLBACK");
        }
        console.error("Add member error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const client = await pool.connect();
    let transactionStarted = false;

    try {
        const { teamId, memberId } = await params;
        if (!teamId || !memberId) {
            return NextResponse.json(
                { message: "Team ID and Member ID missing" },
                { status: 400 }
            );
        }

        const team = await resolveTeam(client, teamId);
        if (!team) {
            return NextResponse.json(
                { message: "Team not found." },
                { status: 404 }
            );
        }
        const authorization = await authorize(request, client, team.id);
        if (!authorization.actor) {
            return NextResponse.json(
                { message: authorization.error },
                { status: authorization.status ?? 401 }
            );
        }

        const {
            role,
            isLead,
            isExec,
            execRole,
            email,
            githubID,
            discordID,
        } = await request.json();
        const hasContactUpdates =
            email !== undefined ||
            githubID !== undefined ||
            discordID !== undefined;

        if (
            typeof role !== "string" ||
            !role.trim() ||
            typeof isLead !== "boolean" ||
            typeof isExec !== "boolean" ||
            (execRole !== null && typeof execRole !== "string") ||
            (isExec && !execRole?.trim()) ||
            (hasContactUpdates &&
                (typeof email !== "string" ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
                    typeof githubID !== "string" ||
                    typeof discordID !== "string"))
        ) {
            return NextResponse.json(
                { message: "Invalid member update details" },
                { status: 400 }
            );
        }

        await client.query("BEGIN");
        transactionStarted = true;
        const target = await getMember(client, team.id, memberId, true);

        if (!target) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "Member not found in team" },
                { status: 404 }
            );
        }

        const actor = authorization.actor;
        const isExecActor = actor.isExec === true;
        const isAuthorizedLead =
            actor.isLead === true &&
            target.isExec !== true &&
            target.isLead !== true;
        if (!isExecActor && !isAuthorizedLead) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "You are not authorized to edit this member" },
                { status: 403 }
            );
        }

        const normalizedExecRole = isExec ? execRole.trim() : null;
        if (
            !isExecActor &&
            (isLead !== target.isLead ||
                isExec !== target.isExec ||
                normalizedExecRole !== (target.execRole ?? null))
        ) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "You are not authorized to change these permissions" },
                { status: 403 }
            );
        }

        if (hasContactUpdates) {
            const existingEmail = await client.query(
                `SELECT "userID"
                 FROM users
                 WHERE LOWER(email) = LOWER($1)
                   AND "userID" <> $2`,
                [email.trim(), memberId]
            );

            if (existingEmail.rows.length > 0) {
                await client.query("ROLLBACK");
                transactionStarted = false;
                return NextResponse.json(
                    { message: "Email is already in use." },
                    { status: 409 }
                );
            }
        }

        await client.query(
            `UPDATE team_members
             SET role = $1, islead = $2
             WHERE id = $3`,
            [role.trim(), isExecActor ? isLead : target.isLead, target.membershipID]
        );
        await client.query(
            `UPDATE users
             SET
                "isExec" = CASE WHEN $1 THEN $2 ELSE "isExec" END,
                "execRole" = CASE WHEN $1 THEN $3 ELSE "execRole" END,
                email = CASE WHEN $4 THEN $5 ELSE email END,
                "githubID" = CASE WHEN $4 THEN $6 ELSE "githubID" END,
                "discordID" = CASE WHEN $4 THEN $7 ELSE "discordID" END
             WHERE id = $8`,
            [
                isExecActor,
                isExec,
                normalizedExecRole,
                hasContactUpdates,
                hasContactUpdates ? email.trim() : null,
                hasContactUpdates ? githubID.trim() || null : null,
                hasContactUpdates ? discordID.trim() || null : null,
                target.id,
            ]
        );

        const updatedMember = await client.query(
            `SELECT ${memberSelectFields}
             FROM team_members tm
             JOIN users u ON u.id = tm.user_id
             JOIN teams t ON t.id = tm.team_id
             WHERE tm.id = $1`,
            [target.membershipID]
        );
        await client.query("COMMIT");
        transactionStarted = false;

        return NextResponse.json(
            {
                message: "Member updated successfully",
                member: updatedMember.rows[0],
            },
            { status: 200 }
        );
    } catch (error) {
        if (transactionStarted) {
            await client.query("ROLLBACK");
        }
        console.error("Update member error:", error);
        return NextResponse.json(
            { message: "Failed to update member" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const client = await pool.connect();

    try {
        const { teamId, memberId } = await params;
        if (!teamId || !memberId) {
            return NextResponse.json(
                { message: "Team ID and Member ID missing" },
                { status: 400 }
            );
        }

        const team = await resolveTeam(client, teamId);
        if (!team) {
            return NextResponse.json(
                { message: "Team not found." },
                { status: 404 }
            );
        }
        const authorization = await authorize(request, client, team.id);
        if (!authorization.actor) {
            return NextResponse.json(
                { message: authorization.error },
                { status: authorization.status ?? 401 }
            );
        }

        const target = await getMember(client, team.id, memberId);
        if (!target) {
            return NextResponse.json(
                { message: "Member not found in team" },
                { status: 404 }
            );
        }

        const actor = authorization.actor;
        const isSelf = actor.userID === memberId;
        const isAuthorizedLead =
            actor.isLead === true &&
            target.isExec !== true &&
            target.isLead !== true;
        if (!isSelf && actor.isExec !== true && !isAuthorizedLead) {
            return NextResponse.json(
                { message: "You are not authorized to remove this member" },
                { status: 403 }
            );
        }

        await client.query(
            `UPDATE team_members
             SET status = 'inactive', dateleft = NOW(), islead = FALSE
             WHERE id = $1`,
            [target.membershipID]
        );

        return NextResponse.json({
            message: "Member removed successfully",
            user: {
                userID: target.userID,
                team: team.name,
                teamID: team.id,
            },
        });
    } catch (error) {
        console.error("Remove member error:", error);
        return NextResponse.json(
            { message: "Failed to remove member" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
