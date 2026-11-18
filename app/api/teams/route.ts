import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import {
    activeMembershipCondition,
    memberSelectFields,
} from "@/lib/teamDb";
import { defaultTeams } from "@/lib/defaultTeams";

export async function GET(request: NextRequest) {
    const developmentDefaultsEnabled = process.env.NODE_ENV !== "production";

    try {
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

        if (developmentDefaultsEnabled) {
            await pool.query(
                `WITH defaults(name) AS (
                    VALUES
                        ('Help Me Bevo'),
                        ('Internal Tooling'),
                        ('LHD Website'),
                        ('Longhorn Lifts'),
                        ('Longhorn Loop'),
                        ('Longhorn Studies'),
                        ('Mobilize UT'),
                        ('Pet Bevo'),
                        ('UT Dining'),
                        ('UT Lectures Plus'),
                        ('UT Marketplace'),
                        ('UT Registration Plus')
                 )
                 INSERT INTO teams (name, description, createdat, updatedat)
                 SELECT defaults.name, '', NOW(), NOW()
                 FROM defaults
                 WHERE NOT EXISTS (
                    SELECT 1
                    FROM teams existing
                    WHERE LOWER(existing.name) = LOWER(defaults.name)
                       OR regexp_replace(LOWER(existing.name), '[^a-z0-9]+', '-', 'g')
                          = regexp_replace(LOWER(defaults.name), '[^a-z0-9]+', '-', 'g')
                 )`
            );
        }

        const teams = await pool.query(
            `SELECT
                id::text AS id,
                name,
                description,
                regexp_replace(LOWER(name), '[^a-z0-9]+', '-', 'g') AS slug
             FROM teams
             ORDER BY name ASC`
        );

        const users = await pool.query(
            `SELECT
                u.name,
                u."memberID",
                u."userID",
                u.email,
                u."githubID",
                u."discordID",
                COALESCE(tm.status, u.status) AS status,
                COALESCE(tm.datejoined, u."dateJoined") AS "dateJoined",
                tm.dateleft AS "dateLeft",
                t.name AS team,
                t.id::text AS "teamID",
                tm.role,
                COALESCE(tm.islead, FALSE) AS "isLead",
                u."isExec",
                u."execRole"
             FROM users u
             LEFT JOIN LATERAL (
                SELECT tm.status, tm.datejoined, tm.dateleft, tm.role,
                       tm.islead, tm.team_id
                FROM team_members tm
                WHERE tm.user_id = u.id
                  AND ${activeMembershipCondition}
                ORDER BY tm.islead DESC, tm.datejoined ASC, tm.id ASC
                LIMIT 1
             ) tm ON TRUE
             LEFT JOIN teams t ON t.id = tm.team_id
             ORDER BY
                CASE WHEN $1::text IS NOT NULL AND u."userID"::text = $1
                     THEN 0 ELSE 1 END,
                CASE WHEN u."isExec" = TRUE THEN 0
                     WHEN tm.islead = TRUE THEN 1 ELSE 2 END,
                t.name ASC NULLS LAST,
                u.name ASC`,
            [currentUserId]
        );

        const members = await pool.query(
            `SELECT ${memberSelectFields}
             FROM users u
             LEFT JOIN team_members tm
               ON tm.user_id = u.id
              AND ${activeMembershipCondition}
             LEFT JOIN teams t ON t.id = tm.team_id
             ORDER BY
                CASE WHEN $1::text IS NOT NULL AND u."userID"::text = $1
                     THEN 0 ELSE 1 END,
                u."isExec" DESC,
                tm.islead DESC,
                t.name ASC NULLS LAST,
                u.name ASC`,
            [currentUserId]
        );

        return NextResponse.json(
            {
                users: users.rows,
                members: members.rows,
                teams: teams.rows,
                databaseAvailable: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching teams and members:", error);

        if (developmentDefaultsEnabled) {
            return NextResponse.json(
                {
                    users: [],
                    members: [],
                    teams: defaultTeams,
                    databaseAvailable: false,
                    warning:
                        "Database unavailable. Showing development defaults; team and member changes are disabled.",
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch teams and members." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("admin_token")?.value;
        const decoded = token ? await verifyToken(token) : null;
        if (!decoded || typeof decoded.adminId !== "number") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const actor = await pool.query(
            `SELECT "isExec"
             FROM users
             WHERE id = $1`,
            [decoded.adminId]
        );
        if (actor.rows.length === 0) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        if (actor.rows[0].isExec !== true) {
            return NextResponse.json(
                { message: "Only executives can create teams." },
                { status: 403 }
            );
        }

        const { name, description } = await request.json();
        if (
            typeof name !== "string" ||
            !name.trim() ||
            (description !== undefined && typeof description !== "string")
        ) {
            return NextResponse.json(
                { message: "A team name is required." },
                { status: 400 }
            );
        }

        const teamName = name.trim();
        const existingTeam = await pool.query(
            `SELECT 1
             FROM teams
             WHERE LOWER(name) = LOWER($1)
                OR regexp_replace(LOWER(name), '[^a-z0-9]+', '-', 'g')
                   = regexp_replace(LOWER($1), '[^a-z0-9]+', '-', 'g')
             LIMIT 1`,
            [teamName]
        );
        if (existingTeam.rows.length > 0) {
            return NextResponse.json(
                { message: "A team with that name already exists." },
                { status: 409 }
            );
        }

        const result = await pool.query(
            `INSERT INTO teams (name, description, createdat, updatedat)
             VALUES ($1, $2, NOW(), NOW())
             RETURNING
                id::text AS id,
                name,
                description,
                regexp_replace(LOWER(name), '[^a-z0-9]+', '-', 'g') AS slug`,
            [teamName, description?.trim() || ""]
        );

        return NextResponse.json(
            { message: "Team created successfully.", team: result.rows[0] },
            { status: 201 }
        );
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505"
        ) {
            return NextResponse.json(
                { message: "A team with that name already exists." },
                { status: 409 }
            );
        }
        console.error("Error creating team:", error);

        return NextResponse.json(
            { message: "Failed to create team." },
            { status: 500 }
        );
    }
}
