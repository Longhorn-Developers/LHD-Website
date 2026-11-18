BEGIN;

INSERT INTO teams (name, description, createdat, updatedat)
SELECT DISTINCT BTRIM(users.team), '', NOW(), NOW()
FROM users
WHERE users.team IS NOT NULL
  AND BTRIM(users.team) <> ''
  AND NOT EXISTS (
      SELECT 1
      FROM teams
      WHERE LOWER(teams.name) = LOWER(BTRIM(users.team))
         OR regexp_replace(LOWER(teams.name), '[^a-z0-9]+', '-', 'g')
            = regexp_replace(LOWER(BTRIM(users.team)), '[^a-z0-9]+', '-', 'g')
  );

INSERT INTO team_members (
    user_id,
    team_id,
    role,
    islead,
    memberid,
    status,
    datejoined,
    dateleft
)
SELECT
    users.id,
    teams.id,
    users.role,
    COALESCE(users."isLead", FALSE),
    users."memberID",
    COALESCE(users.status, 'active'),
    COALESCE(users."dateJoined", NOW()),
    users."dateLeft"
FROM users
JOIN teams
  ON LOWER(teams.name) = LOWER(BTRIM(users.team))
  OR regexp_replace(LOWER(teams.name), '[^a-z0-9]+', '-', 'g')
     = regexp_replace(LOWER(BTRIM(users.team)), '[^a-z0-9]+', '-', 'g')
WHERE users.team IS NOT NULL
  AND BTRIM(users.team) <> ''
  AND NOT EXISTS (
      SELECT 1
      FROM team_members
      WHERE team_members.user_id = users.id
        AND team_members.team_id = teams.id
  );

COMMIT;
