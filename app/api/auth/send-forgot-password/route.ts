import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import transporter from "@/lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        // 1. Find user by email
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            // User not found

            return NextResponse.json({
                "mssg": "User not found."
            }, { status: 404 });
        }

        const admin = user.rows[0];

        if (!admin.isLead && !admin.isExec) {
            // User is not a lead or exec
            return NextResponse.json({
                "mssg": "Unauthorized access."
            }, { status: 403 });

        }

        // 2. Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // 3. Store hashed token + expiration in database

        await pool.query(
            `UPDATE users
            SET reset_token = $1,
                reset_token_expires = $2
            WHERE email = $3`,
            [hashedToken, expiresAt, email]
        );
        // 4. Email reset link to user
        const resetLink = `${process.env.NEXT_PUBLIC_API_KEY}/admin/reset-password?token=${resetToken}`;
        console.log(resetLink);

        await transporter.sendMail({
            from: `"Longhorn Developers" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your LHD Password",
            text: `Password Reset Request

        We received a request to reset your Longhorn Developers account password.

        Reset your password here: ${resetLink}

        This link expires in 15 minutes. If you didn't request a reset, you can safely ignore this email.

        - Longhorn Developers`,
            html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="color-scheme" content="light" />
            <title>Reset Your LHD Password</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f1ec; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

            <!-- Hidden preheader text (shows in inbox preview) -->
            <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
                Use this link to reset your Longhorn Developers password. It expires in 15 minutes.
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f1ec; padding:40px 16px;">
                <tr>
                    <td align="center">

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

                            <!-- Header -->
                            <tr>
                                <td align="center" style="background-color:#BF5700; padding:28px 24px;">
                                    <h1 style="margin:0; font-size:22px; font-weight:700; letter-spacing:0.5px; color:#ffffff;">
                                        Longhorn Developers
                                    </h1>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:40px 40px 16px 40px; color:#333333;">
                                    <h2 style="margin:0 0 16px 0; font-size:24px; font-weight:700; color:#1a1a1a;">
                                        Reset your password
                                    </h2>
                                    <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6; color:#555555;">
                                        We received a request to reset the password for your Longhorn Developers account. Click the button below to choose a new one.
                                    </p>
                                </td>
                            </tr>

                            <!-- Button -->
                            <tr>
                                <td align="center" style="padding:8px 40px 24px 40px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td align="center" bgcolor="#BF5700" style="border-radius:8px;">
                                                <a href="${resetLink}" target="_blank"
                                                style="display:inline-block; padding:14px 36px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px; background-color:#BF5700;">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Expiry notice -->
                            <tr>
                                <td style="padding:0 40px 24px 40px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdf3ea; border-left:4px solid #BF5700; border-radius:4px;">
                                        <tr>
                                            <td style="padding:12px 16px; font-size:14px; line-height:1.5; color:#7a3b00;">
                                                This link expires in <strong>15 minutes</strong>.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Fallback link -->
                            <tr>
                                <td style="padding:0 40px 32px 40px;">
                                    <p style="margin:0 0 6px 0; font-size:13px; color:#888888;">
                                        Button not working? Copy and paste this link into your browser:
                                    </p>
                                    <p style="margin:0; font-size:13px; line-height:1.5; word-break:break-all;">
                                        <a href="${resetLink}" style="color:#BF5700; text-decoration:underline;">${resetLink}</a>
                                    </p>
                                </td>
                            </tr>

                            <!-- Divider -->
                            <tr>
                                <td style="padding:0 40px;">
                                    <hr style="border:none; border-top:1px solid #eeeeee; margin:0;" />
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="padding:24px 40px 32px 40px;">
                                    <p style="margin:0 0 8px 0; font-size:13px; line-height:1.6; color:#888888;">
                                        If you didn't request a password reset, you can safely ignore this email. Your password will not change.
                                    </p>
                                    <p style="margin:0; font-size:13px; color:#aaaaaa;">
                                        &mdash; The Longhorn Developers Team
                                    </p>
                                </td>
                            </tr>

                        </table>

                        <p style="margin:20px 0 0 0; font-size:12px; color:#999999; text-align:center;">
                            &copy; ${new Date().getFullYear()} Longhorn Developers. All rights reserved.
                        </p>

                    </td>
                </tr>
            </table>
        </body>
        </html>
            `,
        });

        return NextResponse.json({
            message: "If an account exists, a reset link has been sent."
        });
    } catch {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}