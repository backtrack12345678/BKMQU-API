-- CreateTable
CREATE TABLE `langganan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(200) NOT NULL,
    `jenis` VARCHAR(200) NOT NULL,
    `harga` INTEGER NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `langganan_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `langgananId` INTEGER NOT NULL,
    `mulai` DATETIME(3) NOT NULL,
    `selesai` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat_langganan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(150) NOT NULL,
    `midtrans_id` VARCHAR(150) NOT NULL,
    `langgananId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `riwayat_langganan_midtrans_id_key`(`midtrans_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `langganan_user` ADD CONSTRAINT `langganan_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `langganan_user` ADD CONSTRAINT `langganan_user_langgananId_fkey` FOREIGN KEY (`langgananId`) REFERENCES `langganan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_langganan` ADD CONSTRAINT `riwayat_langganan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_langganan` ADD CONSTRAINT `riwayat_langganan_midtrans_id_fkey` FOREIGN KEY (`midtrans_id`) REFERENCES `midtrans_transactions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_langganan` ADD CONSTRAINT `riwayat_langganan_langgananId_fkey` FOREIGN KEY (`langgananId`) REFERENCES `langganan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
