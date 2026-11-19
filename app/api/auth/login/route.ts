import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createToken } from "@/lib/auth";
import type { Member } from "@/app/_data/workerFunctions";

export async function POST(request: NextRequest) {
    /* Handle logging in a user */

    /*
    * UserModel
    *
    * Fields:
    * - id: Unique identifier for the user.
    * - name: User's full name.
    * - user_id: Unique username or user identifier.
    * - email: User's email address.
    * - password: User password.
    * - team: Team the user belongs to.
    * - role: User's assigned role.
    * - isLead: Indicates whether the user is a team lead.
    * - isExec: Indicates whether the user is an executive.
    * - exec_role: Specific executive position, if applicable.
    * - created_at: Timestamp indicating when the user account was created.
    */

    const DEVELOPER_EMAIL = "developer@utexas.edu";
    const DEVELOPER_PASSWORD = "longhorndevelopers"

    try {
        
        const { email, password } = await request.json();
        console.log("DEV");
        // DEVELOPMENT PURPOSES: REMOVE IN PRODUCTION
        if (process.env.NODE_ENV === 'development') {
            console.log("DEV");
            
            if (
                email === DEVELOPER_EMAIL &&
                password === DEVELOPER_PASSWORD
            ) {
                const adminId = 1000;
                const user: Member = {
                    name: 'Developer',
                    memberID: 'developer',
                    userID: 'developer',
                    email: 'developer@utexas.edu',
                    githubID: '',
                    discordID: '',
                    status: 'active',
                    dateJoined: new Date(),
                    dateLeft: null,
                    team: 'All',
                    role: 'All',
                    isLead: false,
                    isExec: true,
                    execRole: 'All',
                };

                // Generate token
                const token = await createToken(adminId);

                const response = NextResponse.json({
                    message: "Login successful!",
                    user,
                });

                response.cookies.set("admin_token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60,
                });

                return response;
            }
        }

        const user = await pool.query(
            `SELECT
                u.id,
                u.name,
                u."memberID",
                u."userID",
                u.email,
                u.password,
                u."githubID",
                u."discordID",
                COALESCE(tm.status, u.status) AS status,
                COALESCE(tm.datejoined, u."dateJoined") AS "dateJoined",
                tm.dateleft AS "dateLeft",
                t.name AS team,
                t.id::text AS "teamID",
                tm.id::text AS "membershipID",
                tm.role,
                COALESCE(tm.islead, FALSE) AS "isLead",
                u."isExec",
                u."execRole"
             FROM users u
             LEFT JOIN LATERAL (
                SELECT tm.status, tm.datejoined, tm.dateleft, tm.role,
                       tm.islead, tm.team_id, tm.id
                FROM team_members tm
                WHERE tm.user_id = u.id
                  AND tm.dateleft IS NULL
                ORDER BY tm.islead DESC, tm.datejoined ASC, tm.id ASC
                LIMIT 1
             ) tm ON TRUE
             LEFT JOIN teams t ON t.id = tm.team_id
             WHERE LOWER(u.email) = LOWER($1)`,
            [email]
        );
        

        if (user.rows.length === 0) {
            return NextResponse.json(
                { error: "User not found!" },
                { status: 404 }
            );
        }

        const admin = user.rows[0];

        if (!admin.isLead && !admin.isExec) {
            return NextResponse.json(
                { error: "You are not authorized to access the admin portal!" },
                { status: 403 }
            );
        }

        if (admin.password !== password) {
            return NextResponse.json(
                { error: "Invalid password!" },
                { status: 401 }
            );
        }

        // Generate token
        const token = await createToken(admin.id);

        const safeAdmin: Member = {
            name: admin.name,
            memberID: admin.memberID,
            userID: admin.userID,
            email: admin.email,
            githubID: admin.githubID,
            discordID: admin.discordID,
            status: admin.status,
            dateJoined: admin.dateJoined,
            dateLeft: admin.dateLeft,
            team: admin.team,
            role: admin.role,
            isLead: admin.isLead,
            isExec: admin.isExec,
            execRole: admin.execRole,
        };

        const response = NextResponse.json({
            message: "Login successful!",
            user: safeAdmin,
        });

        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
        });

        return response;

    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: error
        }, { status: 500 })
    }
}