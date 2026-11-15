import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

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
      'SELECT * FROM users WHERE id = $1',
      [decoded.adminId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { password: _, ...user } = result.rows[0];

    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}