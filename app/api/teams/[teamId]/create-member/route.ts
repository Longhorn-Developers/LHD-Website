import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;

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
        } = await req.json();

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof role !== "string" ||
            !role.trim() ||
            typeof isLead !== "boolean" ||
            typeof isExec !== "boolean"
        ) {
            return NextResponse.json(
                { message: "Name, email, role, and permissions are required." },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await pool.query(
            `SELECT 1 FROM users WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { message: "Email already exists." },
                { status: 409 }
            );
        }

        const userID = crypto.randomUUID();
        const memberID = crypto.randomUUID();
        const password = crypto.randomUUID();
        const normalizedStatus =
            typeof status === "string" && status.trim()
                ? status.trim()
                : "active";
        const normalizedGithubID =
            typeof githubID === "string" ? githubID.trim() || null : null;
        const normalizedDiscordID =
            typeof discordID === "string" ? discordID.trim() || null : null;
        const normalizedExecRole =
            typeof execRole === "string" ? execRole.trim() || null : null;

        const result = await pool.query(
            `INSERT INTO users (
                name, "userID", "memberID", email, password, team, role,
                "isLead", "isExec", "execRole", "githubID", "discordID",
                status, "createdAt"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
            RETURNING name, email, "memberID", "userID", "githubID",
                      "discordID", status, team, role, "isLead", "isExec",
                      "execRole", "dateJoined", "dateLeft"`,
            [
                name.trim(),
                userID,
                memberID,
                email.trim().toLowerCase(),
                password,
                teamId,
                role.trim(),
                isLead,
                isExec,
                isExec ? normalizedExecRole : null,
                normalizedGithubID,
                normalizedDiscordID,
                normalizedStatus,
            ]
        );

        return NextResponse.json(
            {
                message: "Member created successfully.",
                member: result.rows[0]
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create member error:", error);

        return NextResponse.json(
            { message: "Failed to create member." },
            { status: 500 }
        );
    }
}