/*
  Warnings:

  - Added the required column `account` to the `Cid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Cid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cid` ADD COLUMN `account` VARCHAR(191) NOT NULL,
    ADD COLUMN `size` INTEGER NOT NULL,
    ADD COLUMN `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
