/*
  Warnings:

  - Added the required column `artist` to the `picks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "picks" ADD COLUMN     "artist" VARCHAR NOT NULL;
