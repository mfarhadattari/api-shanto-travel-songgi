/*
  Warnings:

  - Added the required column `dates` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "dates" TEXT NOT NULL;
