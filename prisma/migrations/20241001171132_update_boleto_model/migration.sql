/*
  Warnings:

  - You are about to drop the column `Status` on the `boleto` table. All the data in the column will be lost.
  - Added the required column `status` to the `Boleto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `boleto` DROP COLUMN `Status`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;
