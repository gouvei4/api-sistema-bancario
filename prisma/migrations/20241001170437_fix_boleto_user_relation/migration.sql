/*
  Warnings:

  - The primary key for the `boleto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `boleto` table. All the data in the column will be lost.
  - You are about to drop the column `paidBy` on the `boleto` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `boleto` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `boleto` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `boleto` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `boleto` DROP FOREIGN KEY `Boleto_userId_fkey`;

-- AlterTable
ALTER TABLE `boleto` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `paidBy`,
    DROP COLUMN `status`,
    DROP COLUMN `updatedAt`,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Boleto` ADD CONSTRAINT `Boleto_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
