import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

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
             RETURNING "userID", name, email, team, role, "isLead", "isExec", "execRole"`,
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