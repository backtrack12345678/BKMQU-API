/*
  Warnings:

  - You are about to alter the column `created_at` on the `aktivitas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `aktivitas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `aktivitas_dokumen` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `aktivitas_dokumen` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `aktivitas_media` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `aktivitas_media` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `bank` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `bank` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `detail_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `detail_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `dokumen_bukti` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `dokumen_bukti` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `dokumen_qr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `dokumen_qr` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `infaq` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `infaq` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `jamaah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `jamaah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kajian` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kajian` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kajian_konten` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kajian_konten` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kajian_konten_media` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kajian_konten_media` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kajian_konten_thumbnail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kajian_konten_thumbnail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kajian_thumbnail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kajian_thumbnail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kas_arus` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kas_arus` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kas_arus_dokumen` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kas_arus_dokumen` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kas_bank` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kas_bank` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kas_mutasi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kas_mutasi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kategori_sedekah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kategori_sedekah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kecamatan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kecamatan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `kota_Kabupaten` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `kota_Kabupaten` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `list_categories` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `list_categories` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `live` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `live` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `live_thumbnail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `live_thumbnail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `midtrans_transactions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `midtrans_transactions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `otp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `otp` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `penceramah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `penceramah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `penerima_sedekah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `penerima_sedekah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `pengurus` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `pengurus` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `photo_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `photo_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `posts_media` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `posts_media` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `provinsi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `provinsi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `refresh_token` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `refresh_token` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `sampul_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `sampul_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `transaksi_mesjid` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `transaksi_mesjid` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `user_bank` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `user_bank` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `user_infaq` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `user_infaq` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `user_sedekah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `user_sedekah` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `aktivitas` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `aktivitas_dokumen` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `aktivitas_media` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `bank` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `detail_user` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `dokumen_bukti` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `dokumen_qr` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `infaq` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `jamaah` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kajian` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kajian_konten` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kajian_konten_media` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kajian_konten_thumbnail` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kajian_thumbnail` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kas` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kas_arus` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kas_arus_dokumen` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kas_bank` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kas_mutasi` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kategori_sedekah` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kecamatan` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `kota_Kabupaten` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `list_categories` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `live` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `live_thumbnail` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `midtrans_transactions` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `otp` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `penceramah` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `penerima_sedekah` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `pengurus` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `photo_user` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `posts` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `posts_media` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `provinsi` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `refresh_token` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `sampul_user` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `transaksi_mesjid` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `user` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `user_bank` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `user_infaq` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- AlterTable
ALTER TABLE `user_sedekah` MODIFY `created_at` DATETIME NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW();

-- CreateTable
CREATE TABLE `podcast` (
    `id` VARCHAR(150) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `judul` VARCHAR(100) NOT NULL,
    `captions` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `podcast_thumbnail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `podcast_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW(),

    UNIQUE INDEX `podcast_thumbnail_podcast_id_key`(`podcast_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `podcast_video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `podcast_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME NULL DEFAULT NOW() ON UPDATE NOW(),

    UNIQUE INDEX `podcast_video_podcast_id_key`(`podcast_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `podcast` ADD CONSTRAINT `podcast_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `podcast_thumbnail` ADD CONSTRAINT `podcast_thumbnail_podcast_id_fkey` FOREIGN KEY (`podcast_id`) REFERENCES `podcast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `podcast_video` ADD CONSTRAINT `podcast_video_podcast_id_fkey` FOREIGN KEY (`podcast_id`) REFERENCES `podcast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
