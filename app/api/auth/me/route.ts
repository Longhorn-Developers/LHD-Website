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
        u.name,
        u.email,
        u."memberID",
        u."userID",
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
      WHERE u.id = $1`,
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
      teamID: row.teamID,
      membershipID: row.membershipID,
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