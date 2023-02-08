/*
  Warnings:

  - Added the required column `fileid` to the `Cid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cid` ADD COLUMN `fileid` BIGINT NOT NULL,
    MODIFY `size` BIGINT NOT NULL;
