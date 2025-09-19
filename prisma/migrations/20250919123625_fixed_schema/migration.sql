/*
  Warnings:

  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Video" DROP CONSTRAINT "Video_sessionId_fkey";

-- DropTable
DROP TABLE "public"."Video";

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "integrity" INTEGER NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_sessionId_key" ON "public"."Report"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."InterviewSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
