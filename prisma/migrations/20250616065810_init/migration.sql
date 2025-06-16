-- CreateEnum
CREATE TYPE "CatalogNodeType" AS ENUM ('LINK', 'STACK', 'DOC');

-- CreateEnum
CREATE TYPE "NavNodeType" AS ENUM ('LINK', 'BOOK', 'DOC');

-- CreateTable
CREATE TABLE "account_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "logo" TEXT,
    "darkLogo" TEXT,
    "copyright" TEXT,
    "google_analytics_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" INTEGER NOT NULL,

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_nodes" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "prev_id" INTEGER,
    "sibling_id" INTEGER,
    "child_id" INTEGER,
    "title" TEXT NOT NULL,
    "type" "CatalogNodeType" NOT NULL,
    "url" TEXT,
    "open_window" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" INTEGER NOT NULL,
    "doc_id" INTEGER,

    CONSTRAINT "catalog_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_nodes" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "prev_id" INTEGER,
    "sibling_id" INTEGER,
    "child_id" INTEGER,
    "level" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "NavNodeType" NOT NULL,
    "url" TEXT,
    "open_window" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" INTEGER,
    "doc_id" INTEGER,

    CONSTRAINT "nav_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_settings_username_key" ON "account_settings"("username");

-- CreateIndex
CREATE UNIQUE INDEX "images_hash_key" ON "images"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "docs_slug_key" ON "docs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_nodes_doc_id_key" ON "catalog_nodes"("doc_id");

-- AddForeignKey
ALTER TABLE "docs" ADD CONSTRAINT "docs_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_nodes" ADD CONSTRAINT "catalog_nodes_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_nodes" ADD CONSTRAINT "catalog_nodes_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "docs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nav_nodes" ADD CONSTRAINT "nav_nodes_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nav_nodes" ADD CONSTRAINT "nav_nodes_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "docs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
