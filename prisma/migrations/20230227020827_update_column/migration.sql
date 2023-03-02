/*
  Warnings:

  - A unique constraint covering the columns `[fileid]` on the table `Cid` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Cid` MODIFY `size` VARCHAR(191) NOT NULL,
    MODIFY `fileid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cid_fileid_key` ON `Cid`(`fileid`);
