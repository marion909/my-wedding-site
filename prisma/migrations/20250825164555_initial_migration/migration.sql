-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "weddings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "weddingDate" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "time" TEXT,
    "dresscode" TEXT,
    "story" TEXT,
    "description" TEXT,
    "templateId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "weddings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "weddings_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "previewImage" TEXT NOT NULL,
    "cssFile" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weddingId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "photos_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weddingId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rsvps_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "weddings_userId_key" ON "weddings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "weddings_slug_key" ON "weddings"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "templates_name_key" ON "templates"("name");
