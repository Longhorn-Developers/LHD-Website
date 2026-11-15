BEGIN;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS "memberID" UUID,
    ADD COLUMN IF NOT EXISTS "githubID" TEXT,
    ADD COLUMN IF NOT EXISTS "discordID" TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS "dateJoined" TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS "dateLeft" TIMESTAMPTZ;

UPDATE users
SET "memberID" = gen_random_uuid()
WHERE "memberID" IS NULL;

ALTER TABLE users
    ALTER COLUMN "memberID" SET DEFAULT gen_random_uuid(),
    ALTER COLUMN "memberID" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_member_id_uidx
    ON users ("memberID");

UPDATE users
SET "dateJoined" = COALESCE("dateJoined", "createdAt", NOW())
WHERE "dateJoined" IS NULL;

ALTER TABLE users
    ALTER COLUMN "dateJoined" SET DEFAULT NOW(),
    ALTER COLUMN "dateJoined" SET NOT NULL;

COMMIT;
