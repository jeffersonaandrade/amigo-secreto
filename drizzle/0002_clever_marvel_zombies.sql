ALTER TABLE `draws` DROP FOREIGN KEY `draws_giverId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `draws` DROP FOREIGN KEY `draws_receiverId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `participants` DROP FOREIGN KEY `participants_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `participants` ADD `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `participants` ADD `email` varchar(320);--> statement-breakpoint
ALTER TABLE `participants` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `participants` ADD `accessToken` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `participants` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `participants` ADD CONSTRAINT `participants_accessToken_unique` UNIQUE(`accessToken`);--> statement-breakpoint
ALTER TABLE `draws` ADD CONSTRAINT `draws_giverId_participants_id_fk` FOREIGN KEY (`giverId`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `draws` ADD CONSTRAINT `draws_receiverId_participants_id_fk` FOREIGN KEY (`receiverId`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `participants` DROP COLUMN `userId`;--> statement-breakpoint
ALTER TABLE `participants` DROP COLUMN `joinedAt`;