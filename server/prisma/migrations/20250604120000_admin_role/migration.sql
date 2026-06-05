-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'tutor', 'admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'student';
