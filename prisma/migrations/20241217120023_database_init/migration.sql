-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `role` VARCHAR(10) NOT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `accept_term` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_phone_key`(`phone`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `tanggal_lahir` DATETIME(3) NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    `kecamatan_id` INTEGER NOT NULL,
    `kota_kab_id` INTEGER NOT NULL,
    `provinsi_id` INTEGER NOT NULL,
    `alamat` TEXT NULL,
    `saldo` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `detail_user_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_bank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `bank_id` INTEGER NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `noRekening` VARCHAR(50) NOT NULL,
    `account_id` VARCHAR(200) NOT NULL DEFAULT '-',
    `status` VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_bank_noRekening_key`(`noRekening`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photo_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(250) NOT NULL DEFAULT 'default_user.jpg',
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `photo_user_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sampul_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(250) NOT NULL DEFAULT 'default_sampul.jpg',
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `sampul_user_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mesjid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `no_register` VARCHAR(200) NOT NULL,
    `imam` VARCHAR(200) NULL,
    `kasBankLimit` INTEGER NOT NULL DEFAULT 2,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mesjid_user_id_key`(`user_id`),
    UNIQUE INDEX `mesjid_no_register_key`(`no_register`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengurus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `jabatan` VARCHAR(100) NOT NULL,
    `uraian_jabatan` VARCHAR(150) NULL,
    `mesjid_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `pengurus_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jamaah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `mesjid_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `jamaah_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penceramah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `keahlian` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `penceramah_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(20) NOT NULL,
    `otp_hashed` VARCHAR(150) NOT NULL,
    `expired_otp` VARCHAR(100) NOT NULL,
    `type` VARCHAR(25) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `otp_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `refresh_token` VARCHAR(250) NOT NULL,
    `notification_token` VARCHAR(250) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `refresh_token_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provinsi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(10) NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kota_kabupaten` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provinsi_id` INTEGER NOT NULL,
    `kode` VARCHAR(10) NOT NULL,
    `nama` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kecamatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provinsi_id` INTEGER NOT NULL,
    `kota_kab_id` INTEGER NOT NULL,
    `kode` VARCHAR(10) NOT NULL,
    `nama` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `kecamatan_kode_key`(`kode`),
    INDEX `kecamatan_nama_idx`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumen_bukti` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(250) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `dokumen_bukti_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumen_qr` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mesjid_id` INTEGER NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `dokumen_qr_mesjid_id_key`(`mesjid_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(250) NOT NULL,
    `captions` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `type` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aktivitas` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `judul` VARCHAR(100) NOT NULL,
    `captions` TEXT NOT NULL,
    `mulai` DATETIME(3) NOT NULL,
    `selesai` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aktivitas_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aktivitas_id` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aktivitas_dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aktivitas_id` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kajian` (
    `id` VARCHAR(150) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `judul` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kajian_thumbnail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kajian_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `kajian_thumbnail_kajian_id_key`(`kajian_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kajian_konten` (
    `id` VARCHAR(191) NOT NULL,
    `kajian_id` VARCHAR(150) NOT NULL,
    `judul` VARCHAR(100) NOT NULL,
    `captions` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kajian_konten_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kajian_konten_id` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `kajian_konten_media_kajian_konten_id_key`(`kajian_konten_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kajian_konten_thumbnail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kajian_konten_id` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `kajian_konten_thumbnail_kajian_konten_id_key`(`kajian_konten_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `live` (
    `id` VARCHAR(150) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `judul` VARCHAR(100) NOT NULL,
    `link` TEXT NOT NULL,
    `mulai` DATETIME(3) NOT NULL,
    `selesai` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `live_thumbnail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `live_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `live_thumbnail_live_id_key`(`live_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `podcast` (
    `id` VARCHAR(150) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `judul` VARCHAR(100) NOT NULL,
    `captions` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `podcast_thumbnail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `podcast_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `podcast_thumbnail_podcast_id_key`(`podcast_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `podcast_video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `podcast_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `podcast_video_podcast_id_key`(`podcast_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kas` (
    `id` VARCHAR(150) NOT NULL,
    `mesjid_user_id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `saldo` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kas_bank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kas_id` VARCHAR(191) NOT NULL,
    `user_bank_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `kas_bank_kas_id_key`(`kas_id`),
    UNIQUE INDEX `kas_bank_user_bank_id_key`(`user_bank_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kas_arus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kas_id` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(10) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `kategori` VARCHAR(30) NOT NULL,
    `metode` VARCHAR(50) NOT NULL,
    `keterangan` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kas_arus_dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kas_arus_detail_id` INTEGER NOT NULL,
    `nama` VARCHAR(250) NOT NULL,
    `path` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `kas_arus_dokumen_kas_arus_detail_id_key`(`kas_arus_detail_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kas_mutasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` BIGINT NOT NULL,
    `mesjid_user_id` VARCHAR(191) NOT NULL,
    `kas_sender_Id` VARCHAR(150) NOT NULL,
    `kas_recipient_Id` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `bank_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `surah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_surah` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ayat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surah_id` INTEGER NOT NULL,
    `nomor_ayat` INTEGER NOT NULL,
    `teks_arab` TEXT NOT NULL,
    `terjemahan` TEXT NOT NULL,
    `teks_latin` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `list_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `midtrans_transactions` (
    `id` VARCHAR(150) NOT NULL,
    `recipient_id` VARCHAR(150) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `net_amount` INTEGER NOT NULL DEFAULT 0,
    `admin_fee` INTEGER NOT NULL DEFAULT 0,
    `redirect_url` VARCHAR(150) NOT NULL,
    `is_inserted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `infaq` (
    `id` VARCHAR(150) NOT NULL,
    `mesjid_user_id` VARCHAR(150) NOT NULL,
    `uraian` TEXT NOT NULL,
    `target_nominal` BIGINT NOT NULL,
    `saldo_masuk` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `infaq_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `infaq_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(150) NOT NULL,
    `path` VARCHAR(150) NOT NULL,
    `type` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_infaq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `midtrans_id` VARCHAR(150) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `pesan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_infaq_midtrans_id_key`(`midtrans_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `infaq_target` (
    `user_infaq_id` INTEGER NOT NULL,
    `infaq_id` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `infaq_target_user_infaq_id_key`(`user_infaq_id`),
    PRIMARY KEY (`user_infaq_id`, `infaq_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori_sedekah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penerima_sedekah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mesjid_user_id` VARCHAR(150) NOT NULL,
    `kategori_id` INTEGER NOT NULL,
    `nama_penerima` VARCHAR(200) NOT NULL,
    `usia` INTEGER NOT NULL,
    `jumlah_keluarga` INTEGER NOT NULL,
    `alamat` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sedekah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `midtrans_id` VARCHAR(150) NOT NULL,
    `kategori_id` INTEGER NOT NULL,
    `pesan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_sedekah_midtrans_id_key`(`midtrans_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Kafalah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `midtrans_id` VARCHAR(150) NOT NULL,
    `pesan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `User_Kafalah_midtrans_id_key`(`midtrans_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `midtrans_id` VARCHAR(150) NOT NULL,
    `pesan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `donasi_midtrans_id_key`(`midtrans_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi_mesjid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mesjid_user_id` VARCHAR(150) NOT NULL,
    `midtrans_id` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `transaksi_mesjid_midtrans_id_key`(`midtrans_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_deactivation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `role` VARCHAR(10) NOT NULL,
    `alasan` TEXT NOT NULL,
    `accept_term` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_deactivation_user_id_key`(`user_id`),
    UNIQUE INDEX `user_deactivation_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withdraw` (
    `id` VARCHAR(150) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `user_bank_id` INTEGER NOT NULL,
    `jumlah` BIGINT NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    `pesan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detail_user` ADD CONSTRAINT `detail_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_user` ADD CONSTRAINT `detail_user_kecamatan_id_fkey` FOREIGN KEY (`kecamatan_id`) REFERENCES `kecamatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_user` ADD CONSTRAINT `detail_user_kota_kab_id_fkey` FOREIGN KEY (`kota_kab_id`) REFERENCES `kota_kabupaten`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_user` ADD CONSTRAINT `detail_user_provinsi_id_fkey` FOREIGN KEY (`provinsi_id`) REFERENCES `provinsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_bank` ADD CONSTRAINT `user_bank_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_bank` ADD CONSTRAINT `user_bank_bank_id_fkey` FOREIGN KEY (`bank_id`) REFERENCES `bank`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photo_user` ADD CONSTRAINT `photo_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sampul_user` ADD CONSTRAINT `sampul_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mesjid` ADD CONSTRAINT `mesjid_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengurus` ADD CONSTRAINT `pengurus_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengurus` ADD CONSTRAINT `pengurus_mesjid_id_fkey` FOREIGN KEY (`mesjid_id`) REFERENCES `mesjid`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jamaah` ADD CONSTRAINT `jamaah_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jamaah` ADD CONSTRAINT `jamaah_mesjid_id_fkey` FOREIGN KEY (`mesjid_id`) REFERENCES `mesjid`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penceramah` ADD CONSTRAINT `penceramah_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kota_kabupaten` ADD CONSTRAINT `kota_kabupaten_provinsi_id_fkey` FOREIGN KEY (`provinsi_id`) REFERENCES `provinsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kecamatan` ADD CONSTRAINT `kecamatan_provinsi_id_fkey` FOREIGN KEY (`provinsi_id`) REFERENCES `provinsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kecamatan` ADD CONSTRAINT `kecamatan_kota_kab_id_fkey` FOREIGN KEY (`kota_kab_id`) REFERENCES `kota_kabupaten`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_bukti` ADD CONSTRAINT `dokumen_bukti_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_qr` ADD CONSTRAINT `dokumen_qr_mesjid_id_fkey` FOREIGN KEY (`mesjid_id`) REFERENCES `mesjid`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts_media` ADD CONSTRAINT `posts_media_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aktivitas` ADD CONSTRAINT `aktivitas_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aktivitas_media` ADD CONSTRAINT `aktivitas_media_aktivitas_id_fkey` FOREIGN KEY (`aktivitas_id`) REFERENCES `aktivitas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aktivitas_dokumen` ADD CONSTRAINT `aktivitas_dokumen_aktivitas_id_fkey` FOREIGN KEY (`aktivitas_id`) REFERENCES `aktivitas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kajian` ADD CONSTRAINT `kajian_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kajian_thumbnail` ADD CONSTRAINT `kajian_thumbnail_kajian_id_fkey` FOREIGN KEY (`kajian_id`) REFERENCES `kajian`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kajian_konten` ADD CONSTRAINT `kajian_konten_kajian_id_fkey` FOREIGN KEY (`kajian_id`) REFERENCES `kajian`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kajian_konten_media` ADD CONSTRAINT `kajian_konten_media_kajian_konten_id_fkey` FOREIGN KEY (`kajian_konten_id`) REFERENCES `kajian_konten`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kajian_konten_thumbnail` ADD CONSTRAINT `kajian_konten_thumbnail_kajian_konten_id_fkey` FOREIGN KEY (`kajian_konten_id`) REFERENCES `kajian_konten`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `live` ADD CONSTRAINT `live_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `live_thumbnail` ADD CONSTRAINT `live_thumbnail_live_id_fkey` FOREIGN KEY (`live_id`) REFERENCES `live`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `podcast` ADD CONSTRAINT `podcast_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `podcast_thumbnail` ADD CONSTRAINT `podcast_thumbnail_podcast_id_fkey` FOREIGN KEY (`podcast_id`) REFERENCES `podcast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `podcast_video` ADD CONSTRAINT `podcast_video_podcast_id_fkey` FOREIGN KEY (`podcast_id`) REFERENCES `podcast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas` ADD CONSTRAINT `kas_mesjid_user_id_fkey` FOREIGN KEY (`mesjid_user_id`) REFERENCES `mesjid`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_bank` ADD CONSTRAINT `kas_bank_kas_id_fkey` FOREIGN KEY (`kas_id`) REFERENCES `kas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_bank` ADD CONSTRAINT `kas_bank_user_bank_id_fkey` FOREIGN KEY (`user_bank_id`) REFERENCES `user_bank`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_arus` ADD CONSTRAINT `kas_arus_kas_id_fkey` FOREIGN KEY (`kas_id`) REFERENCES `kas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_arus_dokumen` ADD CONSTRAINT `kas_arus_dokumen_kas_arus_detail_id_fkey` FOREIGN KEY (`kas_arus_detail_id`) REFERENCES `kas_arus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_mutasi` ADD CONSTRAINT `kas_mutasi_mesjid_user_id_fkey` FOREIGN KEY (`mesjid_user_id`) REFERENCES `mesjid`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_mutasi` ADD CONSTRAINT `kas_mutasi_kas_sender_Id_fkey` FOREIGN KEY (`kas_sender_Id`) REFERENCES `kas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_mutasi` ADD CONSTRAINT `kas_mutasi_kas_recipient_Id_fkey` FOREIGN KEY (`kas_recipient_Id`) REFERENCES `kas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ayat` ADD CONSTRAINT `ayat_surah_id_fkey` FOREIGN KEY (`surah_id`) REFERENCES `surah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `midtrans_transactions` ADD CONSTRAINT `midtrans_transactions_recipient_id_fkey` FOREIGN KEY (`recipient_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `midtrans_transactions` ADD CONSTRAINT `midtrans_transactions_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `list_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `infaq` ADD CONSTRAINT `infaq_mesjid_user_id_fkey` FOREIGN KEY (`mesjid_user_id`) REFERENCES `mesjid`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `infaq_media` ADD CONSTRAINT `infaq_media_infaq_id_fkey` FOREIGN KEY (`infaq_id`) REFERENCES `infaq`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_infaq` ADD CONSTRAINT `user_infaq_midtrans_id_fkey` FOREIGN KEY (`midtrans_id`) REFERENCES `midtrans_transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_infaq` ADD CONSTRAINT `user_infaq_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `infaq_target` ADD CONSTRAINT `infaq_target_user_infaq_id_fkey` FOREIGN KEY (`user_infaq_id`) REFERENCES `user_infaq`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `infaq_target` ADD CONSTRAINT `infaq_target_infaq_id_fkey` FOREIGN KEY (`infaq_id`) REFERENCES `infaq`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penerima_sedekah` ADD CONSTRAINT `penerima_sedekah_mesjid_user_id_fkey` FOREIGN KEY (`mesjid_user_id`) REFERENCES `mesjid`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penerima_sedekah` ADD CONSTRAINT `penerima_sedekah_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_sedekah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sedekah` ADD CONSTRAINT `user_sedekah_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sedekah` ADD CONSTRAINT `user_sedekah_midtrans_id_fkey` FOREIGN KEY (`midtrans_id`) REFERENCES `midtrans_transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sedekah` ADD CONSTRAINT `user_sedekah_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_sedekah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Kafalah` ADD CONSTRAINT `User_Kafalah_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Kafalah` ADD CONSTRAINT `User_Kafalah_midtrans_id_fkey` FOREIGN KEY (`midtrans_id`) REFERENCES `midtrans_transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donasi` ADD CONSTRAINT `donasi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donasi` ADD CONSTRAINT `donasi_midtrans_id_fkey` FOREIGN KEY (`midtrans_id`) REFERENCES `midtrans_transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi_mesjid` ADD CONSTRAINT `transaksi_mesjid_mesjid_user_id_fkey` FOREIGN KEY (`mesjid_user_id`) REFERENCES `mesjid`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi_mesjid` ADD CONSTRAINT `transaksi_mesjid_midtrans_id_fkey` FOREIGN KEY (`midtrans_id`) REFERENCES `midtrans_transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_deactivation` ADD CONSTRAINT `user_deactivation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `withdraw` ADD CONSTRAINT `withdraw_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `withdraw` ADD CONSTRAINT `withdraw_user_bank_id_fkey` FOREIGN KEY (`user_bank_id`) REFERENCES `user_bank`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
