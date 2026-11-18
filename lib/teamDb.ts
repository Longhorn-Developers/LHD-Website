import type { Pool, PoolClient } from "pg";

type Database = Pool | PoolClient;

export async function resolveTeam(
    database: Database,
    identifier: string
): Promise<{ id: string; name: string } | null> {
    const result = await database.query(
        `SELECT id::text AS id, name
         FROM teams
         WHERE id::text = $1
            OR LOWER(name) = LOWER($1)
            OR regexp_replace(LOWER(name), '[^a-z0-9]+', '-', 'g') = LOWER($1)
         LIMIT 1`,
        [identifier]
    );

    return result.rows[0] ?? null;
}

export const memberSelectFields = `
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
    tm.id::text AS "membershipID",
    COALESCE(tm.role, u.role) AS role,
    COALESCE(tm.islead, FALSE) AS "isLead",
    u."isExec",
    u."execRole"
`;

export const activeMembershipCondition = "tm.dateleft IS NULL";
