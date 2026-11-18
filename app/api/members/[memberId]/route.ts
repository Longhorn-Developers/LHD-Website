import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ memberId: string }> }
) {
    const client = await pool.connect();
    let transactionStarted = false;

    try {
        const { memberId } = await params;
        if (!memberId) {
            return NextResponse.json(
                { message: "Member ID missing" },
                { status: 400 }
            );
        }

        const token = request.cookies.get("admin_token")?.value;
        const decoded = token ? await verifyToken(token) : null;
        if (!decoded || typeof decoded.adminId !== "number") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await client.query("BEGIN");
        transactionStarted = true;

        const actorResult = await client.query(
            `SELECT id, "userID", "isExec"
             FROM users
             WHERE id = $1
             FOR UPDATE`,
            [decoded.adminId]
        );
        const actor = actorResult.rows[0];
        if (!actor || actor.isExec !== true) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "Only executives can permanently delete a member." },
                { status: 403 }
            );
        }

        const targetResult = await client.query(
            `SELECT id, "userID"
             FROM users
             WHERE "userID" = $1
             FOR UPDATE`,
            [memberId]
        );
        const target = targetResult.rows[0];
        if (!target) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "Member not found" },
                { status: 404 }
            );
        }

        if (actor.userID === target.userID) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            return NextResponse.json(
                { message: "You cannot delete your own account." },
                { status: 403 }
            );
        }

        await client.query(
            `DELETE FROM team_members WHERE user_id = $1`,
            [target.id]
        );
        await client.query(
            `DELETE FROM users WHERE id = $1`,
            [target.id]
        );

        await client.query("COMMIT");
        transactionStarted = false;
        return NextResponse.json(
            { message: "Member permanently deleted" },
            { status: 200 }
        );
    } catch (error) {
        if (transactionStarted) {
            await client.query("ROLLBACK");
        }

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
    } finally {
        client.release();
    }
}
