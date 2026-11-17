import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string; memberId: string }> }
) {
    try {
        const { teamId, memberId } = await params;

        if (!teamId || !memberId) {
            return NextResponse.json(
                { message: "Team ID and Member ID missing" },
                { status: 400 }
            );
        }

        const {
            role,
            isLead,
            isExec,
            execRole
        } = await request.json();

        const result = await pool.query(
            `UPDATE users
             SET
                team = $1,
                role = $2,
                "isLead" = $3,
                "isExec" = $4,
                "execRole" = $5
             WHERE "userID" = $6
             RETURNING
                name,
                email,
                "memberID",
                "userID",
                "githubID",
                "discordID",
                status,
                "dateJoined",
                "dateLeft",
                team,
                role,
                "isLead",
                "isExec",
                "execRole"`,
            [
                teamId,
                role,
                isLead,
                isExec,
                isExec ? execRole : null,
                memberId
            ]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: "Member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Member successfully added to team",
                member: result.rows[0]
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Add member error:", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string; memberId: string }> }
) {
    try {
        const { teamId, memberId } = await params;

        if (!teamId || !memberId) {
            return NextResponse.json(
                { message: "Team ID and Member ID missing" },
                { status: 400 }
            );
        }

        const token = request.cookies.get("admin_token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const actorResult = await pool.query(
            `SELECT team, role, "isLead", "isExec"
             FROM users
             WHERE id = $1`,
            [decoded.adminId]
        );
        const actor = actorResult.rows[0];

        if (!actor) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
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

        const targetResult = await pool.query(
            `SELECT team, role, "isLead", "isExec", "execRole"
             FROM users
             WHERE "userID" = $1`,
            [memberId]
        );
        const target = targetResult.rows[0];

        if (
            !target ||
            typeof target.team !== "string" ||
            target.team.toLowerCase() !== teamId.toLowerCase()
        ) {
            return NextResponse.json(
                { message: "Member not found in team" },
                { status: 404 }
            );
        }

        const isExecActor = actor.isExec === true;
        const isAuthorizedLead =
            actor.isLead === true &&
            actor.team?.toLowerCase() === target.team.toLowerCase() &&
            actor.role === target.role &&
            target.isExec !== true &&
            target.isLead !== true;

        if (!isExecActor && !isAuthorizedLead) {
            return NextResponse.json(
                { message: "You are not authorized to edit this member" },
                { status: 403 }
            );
        }

        const normalizedExecRole = isExec ? execRole.trim() : null;
        if (
            !isExecActor &&
            (role.trim() !== target.role ||
                isLead !== target.isLead ||
                isExec !== target.isExec ||
                normalizedExecRole !== (target.execRole ?? null))
        ) {
            return NextResponse.json(
                { message: "You are not authorized to change these permissions" },
                { status: 403 }
            );
        }

        if (hasContactUpdates) {
            const existingEmail = await pool.query(
                `SELECT "userID"
                 FROM users
                 WHERE LOWER(email) = LOWER($1)
                   AND "userID" <> $2`,
                [email.trim(), memberId]
            );

            if (existingEmail.rows.length > 0) {
                return NextResponse.json(
                    { message: "Email is already in use." },
                    { status: 409 }
                );
            }
        }

        const result = await pool.query(
            `UPDATE users
             SET
                team = $1,
                role = $2,
                "isLead" = $3,
                "isExec" = $4,
                "execRole" = $5,
                email = CASE WHEN $6 THEN $7 ELSE email END,
                "githubID" = CASE WHEN $6 THEN $8 ELSE "githubID" END,
                "discordID" = CASE WHEN $6 THEN $9 ELSE "discordID" END
             WHERE "userID" = $10
             RETURNING
                name,
                email,
                "memberID",
                "userID",
                "githubID",
                "discordID",
                status,
                "dateJoined",
                "dateLeft",
                team,
                role,
                "isLead",
                "isExec",
                "execRole"`,
            [
                target.team,
                role.trim(),
                isLead,
                isExec,
                normalizedExecRole,
                hasContactUpdates,
                hasContactUpdates ? email.trim() : null,
                hasContactUpdates ? githubID.trim() || null : null,
                hasContactUpdates ? discordID.trim() || null : null,
                memberId,
            ]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: "Member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Member updated successfully",
                member: result.rows[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update member error:", error);

        return NextResponse.json(
            { message: "Failed to update member" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string; memberId: string }> }
) {

    // Removes a member from a team

    try {
        const { teamId, memberId } = await params;

        if (!teamId || !memberId) {
            console.log("MISSING");
            return NextResponse.json(
                { message: "Team ID and Member ID missing" },
                { status: 400 }
            );
        }

        const teamName = teamId
        .replace(/-/g, " ")
        .toUpperCase();

        const result = await pool.query(
            `UPDATE users
            SET team = NULL,
                "isLead" = FALSE
            WHERE "userID" = $1 AND UPPER(team) = UPPER($2)
            RETURNING id, name, team`,
            [memberId, teamName]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: "Member not found in team" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Member removed successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error("Remove member error:", error);

        return NextResponse.json(
            { message: "Failed to remove member" },
            { status: 500 }
        );
    }
}