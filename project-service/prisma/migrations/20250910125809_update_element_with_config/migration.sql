/*
  Warnings:

  - You are about to drop the column `content` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Element` table. All the data in the column will be lost.
  - Added the required column `config` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Element" DROP COLUMN "content",
DROP COLUMN "height",
DROP COLUMN "width",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "config" JSONB NOT NULL;
