CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) UNIQUE NOT NULL,
    `nickname` VARCHAR(255) NOT NULL,
    `photo_profile` VARCHAR(255),
    `bio` TEXT,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) UNIQUE NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `recipes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `admin_id` INT,
    `title` VARCHAR(255),
    `description` TEXT,
    `portion` INT,
    `cooking_time` INT,
    `status` ENUM('process', 'approved', 'rejected') DEFAULT 'process',
    `admin_comment` TEXT,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE
);

CREATE TABLE `recipe_photos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `recipe_id` INT,
    `photo_url` VARCHAR(255),
    FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
);

CREATE TABLE `ingredients` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `recipe_id` INT,
    `name` VARCHAR(255),
    FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
);

CREATE TABLE `instructions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `recipe_id` INT,
    `step_description` VARCHAR(255),
    FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
);

CREATE TABLE `instruction_photos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `instruction_id` INT,
    `photo_url` VARCHAR(255),
    FOREIGN KEY (`instruction_id`) REFERENCES `instructions`(`id`) ON DELETE CASCADE
);

CREATE TABLE `favorites` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `recipe_id` INT,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
);

CREATE TABLE `testimonials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `recipe_id` INT,
    `comment` TEXT,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
);

CREATE TABLE `testimonial_photos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `testimonial_id` INT,
    `photo_url` VARCHAR(255),
    FOREIGN KEY (`testimonial_id`) REFERENCES `testimonials`(`id`) ON DELETE CASCADE
);
