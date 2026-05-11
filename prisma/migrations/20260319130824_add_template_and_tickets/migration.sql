/*
  Warnings:

  - You are about to drop the column `clientId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `codeQR` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `dateScan` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `buyerName` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "templateImage" TEXT,
    "qrX" INTEGER NOT NULL DEFAULT 20,
    "qrY" INTEGER NOT NULL DEFAULT 20,
    "serialX" INTEGER NOT NULL DEFAULT 20,
    "serialY" INTEGER NOT NULL DEFAULT 60,
    "fontSize" INTEGER NOT NULL DEFAULT 10,
    "fontColor" TEXT NOT NULL DEFAULT '#000000',
    "gridCols" INTEGER NOT NULL DEFAULT 2,
    "gridRows" INTEGER NOT NULL DEFAULT 2,
    "marginMm" INTEGER NOT NULL DEFAULT 5,
    "gapMm" INTEGER NOT NULL DEFAULT 3
);
INSERT INTO "new_Event" ("createdAt", "date", "eventId", "location", "name") SELECT "createdAt", "date", "eventId", "location", "name" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Ticket" (
    "ticketId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("eventId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("createdAt", "eventId", "status", "ticketId") SELECT "createdAt", "eventId", "status", "ticketId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_serialNumber_key" ON "Ticket"("serialNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
