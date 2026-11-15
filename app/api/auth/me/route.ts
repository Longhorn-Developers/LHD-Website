import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';
import type { Member } from '@/app/_data/workerFunctions';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
        return NextResponse.json(
            { message: 'Valid token not found,' },
            { status: 404 }
        );
    }

    const result = await pool.query(
      `SELECT
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
        "execRole"
      FROM users
      WHERE id = $1`,
      [decoded.adminId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const user: Member = {
      name: row.name,
      email: row.email,
      memberID: row.memberID,
      userID: row.userID,
      githubID: row.githubID,
      discordID: row.discordID,
      status: row.status,
      dateJoined: row.dateJoined,
      dateLeft: row.dateLeft,
      team: row.team,
      role: row.role,
      isLead: row.isLead,
      isExec: row.isExec,
      execRole: row.execRole,
    };

    return NextResponse.json({ user });

  } catch {
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}