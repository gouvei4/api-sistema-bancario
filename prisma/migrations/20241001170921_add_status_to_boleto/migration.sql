/*
  Warnings:

  - Added the required column `Status` to the `Boleto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `boleto` ADD COLUMN `Status` VARCHAR(191) NOT NULL;
