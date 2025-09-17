-- CreateEnum
CREATE TYPE "workspace"."ElementType" AS ENUM ('RECTANGLE', 'TEXT', 'LINE');

-- CreateTable
CREATE TABLE "workspace"."Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace"."Board" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,
    "authorId" INTEGER,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace"."Element" (
    "id" TEXT NOT NULL,
    "type" "workspace"."ElementType" NOT NULL,
    "config" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "workspace"."Project"("name");

-- CreateIndex
CREATE INDEX "Board_projectId_idx" ON "workspace"."Board"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Board_projectId_name_key" ON "workspace"."Board"("projectId", "name");

-- AddForeignKey
ALTER TABLE "workspace"."Board" ADD CONSTRAINT "Board_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "workspace"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."Element" ADD CONSTRAINT "Element_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "workspace"."Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
