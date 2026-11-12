import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createToken } from "@/lib/auth";

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
       
        // DEVELOPMENT PURPOSES: REMOVE IN PRODUCTION
        if (process.env.NODE_ENV === 'development') {
            console.log("DEV");
            if (
                email === DEVELOPER_EMAIL &&
                password === DEVELOPER_PASSWORD
            ) {
                const admin = {
                id: 1000,
                name: 'Developer',
                userId: 'developer',
                email: 'developer@utexas.edu',
                team: 'Development',
                role: 'Developer',
                isLead: true,
                isExec: true,
                exec_role: 'Developer',
                };

                // Generate token
                const token = await createToken(admin.id);

                const response = NextResponse.json({
                    message: "Login successful!",
                    user: admin,
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
            "SELECT * FROM users WHERE email = $1",
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

        const { password: _, ...safeAdmin } = admin;

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