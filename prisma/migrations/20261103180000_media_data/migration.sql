-- CreateTable
CREATE TABLE `MediaData` (
    `mediaId` VARCHAR(191) NOT NULL,
    `data` LONGBLOB NOT NULL,

    PRIMARY KEY (`mediaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Media_url_idx` ON `Media`(`url`);

-- AddForeignKey
ALTER TABLE `MediaData` ADD CONSTRAINT `MediaData_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
