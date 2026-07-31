CREATE TABLE `customer_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`mode` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`suburb` text DEFAULT '' NOT NULL,
	`pickup_time` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`items` text NOT NULL,
	`total` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menu_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menu_products` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`price` real DEFAULT 0 NOT NULL,
	`image` text DEFAULT '/butter-chicken.webp' NOT NULL,
	`size_options` text DEFAULT '[]' NOT NULL,
	`spice_options` text DEFAULT '[]' NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `restaurant_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
