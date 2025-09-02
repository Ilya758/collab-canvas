-- AlterTable
ALTER TABLE "public"."Board" ADD COLUMN     "authorId" INTEGER;

-- CreateIndex
CREATE INDEX "Board_projectId_idx" ON "public"."Board"("projectId");

-- AddForeignKey
ALTER TABLE "public"."Board" ADD CONSTRAINT "Board_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
