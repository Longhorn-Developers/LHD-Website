import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ memberId: string }> }
) {
    try {
        const { memberId } = await params;
        if (!memberId) {
            return NextResponse.json(
                { message: "Member ID missing" },
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
            `SELECT "userID", team, role, "isLead", "isExec"
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

        const targetResult = await pool.query(
            `SELECT "userID", team, role, "isLead", "isExec"
             FROM users
             WHERE "userID" = $1`,
            [memberId]
        );
        const target = targetResult.rows[0];
        if (!target) {
            return NextResponse.json(
                { message: "Member not found" },
                { status: 404 }
            );
        }

        const isAuthorizedLead =
            actor.isLead === true &&
            typeof actor.team === "string" &&
            typeof target.team === "string" &&
            actor.team.toLowerCase() === target.team.toLowerCase() &&
            actor.role === target.role &&
            target.isExec !== true &&
            target.isLead !== true;
        const isAuthorized =
            actor.userID !== memberId &&
            typeof target.team === "string" &&
            Boolean(target.team.trim()) &&
            (actor.isExec === true || isAuthorizedLead);

        if (!isAuthorized) {
            return NextResponse.json(
                { message: "You are not authorized to delete this member" },
                { status: 403 }
            );
        }

        const result = await pool.query(
            `DELETE FROM users
             WHERE "userID" = $1
             RETURNING "userID"`,
            [memberId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: "Member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Member permanently deleted" },
            { status: 200 }
        );
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23503"
        ) {
            return NextResponse.json(
                {
                    message:
                        "This member cannot be deleted while related records still exist.",
                },
                { status: 409 }
            );
        }

        console.error("Delete member error:", error);
        return NextResponse.json(
            { message: "Failed to delete member" },
            { status: 500 }
        );
    }
}
