SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `waarderingsapp`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `waarderingsapp`;

-- Droppen in omgekeerde FK-volgorde zodat re-runs veilig zijn.
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `login_verifications`;
DROP TABLE IF EXISTS `pending_registrations`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `teachers`;

CREATE TABLE `students` (
  `id`              INT(11)      NOT NULL AUTO_INCREMENT,
  `profile_picture` VARCHAR(255) NOT NULL,
  `first_name`      VARCHAR(100) NOT NULL,
  `last_name`       VARCHAR(100) NOT NULL,
  `email`           VARCHAR(255) NOT NULL,
  `password`        VARCHAR(255) NOT NULL,
  `student_number`  INT(7)       NOT NULL,
  `theme_color`     VARCHAR(7)   NOT NULL DEFAULT '#FF9408',
  `created_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_student_email`  (`email`),
  UNIQUE KEY `uniq_student_number` (`student_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `teachers` (
  `id`                   INT(11)      NOT NULL AUTO_INCREMENT,
  `profile_picture`      VARCHAR(255) NOT NULL,
  `first_name`           VARCHAR(100) NOT NULL,
  `last_name`            VARCHAR(100) NOT NULL,
  `email`                VARCHAR(255) NOT NULL,
  `password`             VARCHAR(255) NOT NULL,
  `abbreviation_teacher` VARCHAR(10)  NOT NULL,
  `theme_color`          VARCHAR(7)   NOT NULL DEFAULT '#39dea1',
  `created_at`           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_teacher_email`        (`email`),
  UNIQUE KEY `uniq_teacher_abbreviation` (`abbreviation_teacher`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- user_id = student over wie de review gaat; teacher_id = auteur bij role='teacher', anders NULL.
CREATE TABLE `reviews` (
  `id`            INT(11)                    NOT NULL AUTO_INCREMENT,
  `user_id`       INT(11)                    NOT NULL,
  `role`          ENUM('customer','teacher') NOT NULL,
  `teacher_id`    INT(11)                    DEFAULT NULL,
  `customer_name` VARCHAR(20)                DEFAULT NULL,
  `project_name`  VARCHAR(30)                DEFAULT NULL,
  `present`       TINYINT(2)                 NOT NULL,
  `organise`      TINYINT(2)                 NOT NULL,
  `independence`  TINYINT(2)                 NOT NULL,
  `collaborate`   TINYINT(2)                 NOT NULL,
  `communicate`   TINYINT(2)                 NOT NULL,
  `review`        TEXT                       NOT NULL,
  `created_at`    TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_user_id`    (`user_id`),
  KEY `idx_reviews_teacher_id` (`teacher_id`),
  CONSTRAINT `fk_reviews_student` FOREIGN KEY (`user_id`)    REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- payload bevat hashed password + names + studentnr/afkorting + pending-fotopad tot 2FA is bevestigd.
CREATE TABLE `pending_registrations` (
  `id`         INT(11)                    NOT NULL AUTO_INCREMENT,
  `token`      CHAR(64)                   NOT NULL,
  `role`       ENUM('student','teacher')  NOT NULL,
  `email`      VARCHAR(255)               NOT NULL,
  `payload`    JSON                       NOT NULL,
  `code_hash`  CHAR(64)                   NOT NULL,
  `attempts`   TINYINT                    NOT NULL DEFAULT 0,
  `expires_at` DATETIME                   NOT NULL,
  `created_at` TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_pending_token`   (`token`),
  KEY        `idx_pending_expires`  (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `login_verifications` (
  `id`         INT(11)                    NOT NULL AUTO_INCREMENT,
  `token`      CHAR(64)                   NOT NULL,
  `role`       ENUM('student','teacher')  NOT NULL,
  `user_id`    INT(11)                    NOT NULL,
  `code_hash`  CHAR(64)                   NOT NULL,
  `attempts`   TINYINT                    NOT NULL DEFAULT 0,
  `expires_at` DATETIME                   NOT NULL,
  `created_at` TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_login_token`   (`token`),
  KEY        `idx_login_expires`  (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
