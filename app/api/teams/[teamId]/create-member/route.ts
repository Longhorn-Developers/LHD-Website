import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;

        const { name, email, role, isLead, isExec } = await req.json();

        console.log(teamId);

        if (!name?.trim() || !email?.trim() || !role) {
            return NextResponse.json(
                { message: "Name, email, and role are required." },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await pool.query(
            `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { message: "Email already exists." },
                { status: 409 }
            );
        }

        const userID = crypto.randomUUID();
        const password = crypto.randomUUID();

        const result = await pool.query(
            `INSERT INTO users (
                name, "userID", email, password, team, role,
                "isLead", "isExec", "execRole", "createdAt"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL, NOW())
            RETURNING id, name, "userID", email, team, role,
                      "isLead", "isExec", "execRole", "createdAt"`,
            [
                name.trim(),
                userID,
                email.trim().toLowerCase(),
                password,
                teamId,
                role,
                isLead,
                isExec
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