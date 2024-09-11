/*
  Warnings:

  - The primary key for the `tripReqs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tripReqs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tripReqs" DROP CONSTRAINT "tripReqs_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "tripReqs_pkey" PRIMARY KEY ("userId", "tripId");
