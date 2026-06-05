-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "stored_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "invite_code" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_messages" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "attachment" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "uploaded_files_user_id_idx" ON "uploaded_files"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "study_groups_invite_code_key" ON "study_groups"("invite_code");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_group_id_user_id_key" ON "group_members"("group_id", "user_id");

-- CreateIndex
CREATE INDEX "group_messages_group_id_idx" ON "group_messages"("group_id");

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_messages" ADD CONSTRAINT "group_messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_messages" ADD CONSTRAINT "group_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
