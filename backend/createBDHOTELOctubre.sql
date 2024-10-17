-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.4.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para hotel
CREATE DATABASE IF NOT EXISTS `hotel` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `hotel`;

-- Volcando estructura para tabla hotel.adonis_schema
CREATE TABLE IF NOT EXISTS `adonis_schema` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  `migration_time` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.adonis_schema: ~22 rows (aproximadamente)
INSERT INTO `adonis_schema` (`id`, `name`, `batch`, `migration_time`) VALUES
	(124, 'database/migrations/1721371739325_create_rols_table', 1, '2024-09-13 01:24:04'),
	(125, 'database/migrations/1721911569557_create_modulos_table', 1, '2024-09-13 01:24:04'),
	(126, 'database/migrations/1721911596099_create_modulo_rols_table', 1, '2024-09-13 01:24:04'),
	(127, 'database/migrations/1721911831789_create_users_table', 1, '2024-09-13 01:24:04'),
	(128, 'database/migrations/1721911867111_create_acces_tokens_table', 1, '2024-09-13 01:24:04'),
	(129, 'database/migrations/1721911891334_create_clientes_table', 1, '2024-09-13 01:24:04'),
	(130, 'database/migrations/1722117031838_create_nivels_table', 1, '2024-09-13 01:24:04'),
	(131, 'database/migrations/1722117056372_create_clase_habitacions_table', 1, '2024-09-13 01:24:04'),
	(132, 'database/migrations/1722117068524_create_habitacions_table', 1, '2024-09-13 01:24:05'),
	(133, 'database/migrations/1722117083127_create_reservacions_table', 1, '2024-09-13 01:24:05'),
	(134, 'database/migrations/1723287478843_create_hospedajes_table', 1, '2024-09-13 01:24:05'),
	(135, 'database/migrations/1723313842541_create_productos_table', 1, '2024-09-13 01:24:05'),
	(136, 'database/migrations/1723320319860_create_detalle_hospedajes_table', 1, '2024-09-13 01:24:05'),
	(137, 'database/migrations/1723905493362_create_apertura_cajas_table', 1, '2024-09-13 01:24:05'),
	(138, 'database/migrations/1723905972159_create_arqueo_cajas_table', 1, '2024-09-13 01:24:05'),
	(139, 'database/migrations/1723906020207_create_cierre_cajas_table', 1, '2024-09-13 01:24:05'),
	(140, 'database/migrations/1724512365208_create_tipogastos_table', 1, '2024-09-13 01:24:05'),
	(141, 'database/migrations/1724512398707_create_proveedors_table', 1, '2024-09-13 01:24:05'),
	(142, 'database/migrations/1724512419675_create_gastos_table', 1, '2024-09-13 01:24:05'),
	(143, 'database/migrations/1725125608506_create_facturas_table', 1, '2024-09-13 01:24:05'),
	(144, 'database/migrations/1725125642848_create_detalle_facturas_table', 1, '2024-09-13 01:24:05'),
	(145, 'database/migrations/1725531314100_create_opcion_pagos_table', 1, '2024-09-13 01:24:05');

-- Volcando estructura para tabla hotel.adonis_schema_versions
CREATE TABLE IF NOT EXISTS `adonis_schema_versions` (
  `version` int(10) unsigned NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.adonis_schema_versions: ~1 rows (aproximadamente)
INSERT INTO `adonis_schema_versions` (`version`) VALUES
	(2);

-- Volcando estructura para tabla hotel.apertura_caja
CREATE TABLE IF NOT EXISTS `apertura_caja` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `monto` float(8,2) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `apertura_caja_user_id_foreign` (`user_id`),
  CONSTRAINT `apertura_caja_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.apertura_caja: ~2 rows (aproximadamente)
INSERT INTO `apertura_caja` (`id`, `user_id`, `fecha`, `observaciones`, `monto`, `anulado`) VALUES
	(1, 1, '2024-09-19 13:15:48', 'Efectivo inicial', 250.00, 1),
	(2, 1, '2024-09-21 22:13:18', NULL, 200.00, 0),
	(3, 1, '2024-09-28 22:26:20', 'EFECTIVO', 300.00, 0),
	(4, 1, '2024-10-17 10:28:55', 'Hola', 45.00, 0);

-- Volcando estructura para tabla hotel.arqueo_caja
CREATE TABLE IF NOT EXISTS `arqueo_caja` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `apertura_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `monto` float(8,2) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `arqueo_caja_apertura_id_foreign` (`apertura_id`),
  KEY `arqueo_caja_user_id_foreign` (`user_id`),
  CONSTRAINT `arqueo_caja_apertura_id_foreign` FOREIGN KEY (`apertura_id`) REFERENCES `apertura_caja` (`id`),
  CONSTRAINT `arqueo_caja_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.arqueo_caja: ~0 rows (aproximadamente)
INSERT INTO `arqueo_caja` (`id`, `apertura_id`, `user_id`, `fecha`, `monto`, `anulado`) VALUES
	(1, 2, NULL, '2024-09-22 02:02:10', 2450.00, 0),
	(2, 3, NULL, '2024-09-28 17:10:44', 1000.00, 0);

-- Volcando estructura para tabla hotel.auth_access_tokens
CREATE TABLE IF NOT EXISTS `auth_access_tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_id` int(10) unsigned NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `hash` varchar(255) NOT NULL,
  `abilities` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `auth_access_tokens_tokenable_id_foreign` (`tokenable_id`),
  CONSTRAINT `auth_access_tokens_tokenable_id_foreign` FOREIGN KEY (`tokenable_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.auth_access_tokens: ~43 rows (aproximadamente)
INSERT INTO `auth_access_tokens` (`id`, `tokenable_id`, `type`, `name`, `hash`, `abilities`, `created_at`, `updated_at`, `last_used_at`, `expires_at`) VALUES
	(2, 1, 'auth_token', NULL, '9779f95239b17e654651fcb2db26e9247ea8439026f2f61a4b66cc7ca2e5c1d9', '["*"]', '2024-09-13 07:26:34', '2024-09-13 07:26:34', '2024-09-13 15:09:45', '2024-09-15 07:26:34'),
	(3, 1, 'auth_token', NULL, '3e3c2dbb1ceb30c1aad1838a9ec71f0570aad38f77b4611bab4ff2fac64963ad', '["*"]', '2024-09-13 15:09:54', '2024-09-13 15:09:54', '2024-09-14 06:30:22', '2024-09-15 15:09:54'),
	(4, 1, 'auth_token', NULL, '3f53c8d35416c36224977888eee86305e72979c8600fc3e0049795adf550152a', '["*"]', '2024-09-14 05:03:54', '2024-09-14 05:03:54', '2024-09-16 13:44:37', '2024-09-16 05:03:54'),
	(5, 1, 'auth_token', NULL, 'c80cfbfdf1196048e20620449ff6731aabf41c2705df5265198652ee6623f782', '["*"]', '2024-09-14 06:30:27', '2024-09-14 06:30:27', '2024-09-14 14:00:11', '2024-09-16 06:30:27'),
	(6, 1, 'auth_token', NULL, 'a74221b3bbdf8a525ba0ff05746f8e8f20b95b0f22f3cca986aced89c0757a05', '["*"]', '2024-09-14 14:00:17', '2024-09-14 14:00:17', '2024-09-14 16:46:24', '2024-09-16 14:00:17'),
	(9, 1, 'auth_token', NULL, '33f234e91131b77ddfabbaa77f2bc3b046e5fffd27836ff42a3457744bd50308', '["*"]', '2024-09-15 01:19:14', '2024-09-15 01:19:14', '2024-09-15 11:14:40', '2024-09-17 01:19:14'),
	(10, 1, 'auth_token', NULL, '0460196945e568f801b1366abed1201d81cc9e7da4e6c12d9f129e0025beac5c', '["*"]', '2024-09-15 11:14:57', '2024-09-15 11:14:57', '2024-09-16 04:30:37', '2024-09-17 11:14:57'),
	(11, 1, 'auth_token', NULL, '425d031777abdab516f00f82580efd52e81508bbfb99284381dcdec37a5e11e1', '["*"]', '2024-09-16 04:30:45', '2024-09-16 04:30:45', '2024-09-17 03:36:54', '2024-09-18 04:30:45'),
	(12, 1, 'auth_token', NULL, 'ab78ae798dd27a82a5105513abb8f25f1a9445c7d896707412cc3895c1279f7d', '["*"]', '2024-09-16 13:44:44', '2024-09-16 13:44:44', '2024-09-17 03:47:53', '2024-09-18 13:44:44'),
	(13, 1, 'auth_token', NULL, '77278bcce0298b7e9319ba54cb40b90ff92df97bacf90213c5f1cd314d86e1b2', '["*"]', '2024-09-17 03:37:03', '2024-09-17 03:37:03', '2024-09-17 06:43:22', '2024-09-19 03:37:03'),
	(14, 1, 'auth_token', NULL, '362291b2dd6a58057dcbf01e3fa124121f78b133031a31d6de19e301168d219b', '["*"]', '2024-09-17 03:47:58', '2024-09-17 03:47:58', '2024-09-17 06:43:50', '2024-09-19 03:47:58'),
	(15, 1, 'auth_token', NULL, '1de9aa7812bce53e066924e570103c52e4079cc20db6dc9eff46f72ffad6c3d6', '["*"]', '2024-09-17 06:43:26', '2024-09-17 06:43:26', '2024-09-18 09:18:46', '2024-09-19 06:43:26'),
	(16, 1, 'auth_token', NULL, '21b685f8dc5b94a05006c4501324081851d1d7ef820d638d2e765bb109f797b0', '["*"]', '2024-09-17 06:44:00', '2024-09-17 06:44:00', '2024-09-18 09:36:35', '2024-09-19 06:44:00'),
	(17, 1, 'auth_token', NULL, '4f74238a2700ac90179ed2d63b7b663733b975ce5344c2db20b193d870b99f91', '["*"]', '2024-09-18 09:18:50', '2024-09-18 09:18:50', '2024-09-21 01:26:51', '2024-09-20 09:18:50'),
	(18, 1, 'auth_token', NULL, 'e0f13be407232a8fbaa1c4f126e4caf2e0ad0f561d9da4e4eb954350e6be7113', '["*"]', '2024-09-18 09:36:43', '2024-09-18 09:36:43', '2024-09-19 17:47:05', '2024-09-20 09:36:43'),
	(19, 1, 'auth_token', NULL, '10130cec2821876e870fa5911a6fd7afab80223a38a8cfbb02e259e7b5e2d165', '["*"]', '2024-09-19 17:47:23', '2024-09-19 17:47:23', '2024-09-20 14:31:41', '2024-09-21 17:47:23'),
	(20, 1, 'auth_token', NULL, 'c4edcf98e8779a3320a64fc30461b80edfd3ceef1cf24f75c1d9033ac28b1207', '["*"]', '2024-09-20 14:36:08', '2024-09-20 14:36:08', '2024-09-21 05:30:35', '2024-09-22 14:36:08'),
	(21, 1, 'auth_token', NULL, 'afcd4ea2d9204906257aa539e42f395b4415ffb2ea361bd9f443ec62a58d15ce', '["*"]', '2024-09-21 01:26:56', '2024-09-21 01:26:56', '2024-09-26 08:31:11', '2024-09-23 01:26:56'),
	(22, 1, 'auth_token', NULL, '4a70ca0828887c567930148f0c4f1883abd0e8a0b9be294b781d08ac9a9eb0a8', '["*"]', '2024-09-21 05:30:42', '2024-09-21 05:30:42', '2024-09-22 01:24:58', '2024-09-23 05:30:42'),
	(23, 1, 'auth_token', NULL, '2ccbf3b7b2fabd3d9cccbb4323744381d05e2ccd588657e566947078f90ae17b', '["*"]', '2024-09-22 01:32:59', '2024-09-22 01:32:59', '2024-09-22 13:25:31', '2024-09-24 01:32:59'),
	(24, 1, 'auth_token', NULL, '49cba486c4c39b3068868392c8209bbffe78b9c00eb65f221aaacddcb5530438', '["*"]', '2024-09-22 13:30:25', '2024-09-22 13:30:25', '2024-09-22 20:55:24', '2024-09-24 13:30:25'),
	(25, 1, 'auth_token', NULL, '25e6876092486d80ea9f7ef332c9ec5d3fe8af10d351537c30db603d5beb9a5d', '["*"]', '2024-09-22 20:55:32', '2024-09-22 20:55:32', '2024-09-24 18:01:50', '2024-09-24 20:55:32'),
	(26, 1, 'auth_token', NULL, 'c648abf1ca007b34b3031b68b14c5a9c0ac239dbfb83ea8ce2c7c79e13b88888', '["*"]', '2024-09-24 18:08:55', '2024-09-24 18:08:55', '2024-09-25 07:45:49', '2024-09-26 18:08:55'),
	(27, 1, 'auth_token', NULL, '5879e8d8122f599c6cbc276a129779161f92aec3f1454d45ebed6b6df3c87437', '["*"]', '2024-09-25 07:45:56', '2024-09-25 07:45:56', '2024-09-25 20:17:09', '2024-09-27 07:45:56'),
	(28, 1, 'auth_token', NULL, 'a9b110c41ddb9e834f75bebfce6aafb7354224da39154f012a5edf63bd5faa9c', '["*"]', '2024-09-25 20:17:15', '2024-09-25 20:17:15', '2024-09-29 05:01:16', '2024-09-27 20:17:15'),
	(29, 1, 'auth_token', NULL, '41263d189ab06d21bc2cd029b708505066f11708f1e5404b3c5f452eb9889e3e', '["*"]', '2024-09-26 08:31:31', '2024-09-26 08:31:31', '2024-09-27 07:17:28', '2024-09-28 08:31:31'),
	(30, 1, 'auth_token', NULL, 'd17045de120c9d266e4ae68512050dd4d464595c6accfba0949cb679727e13ce', '["*"]', '2024-09-27 07:17:34', '2024-09-27 07:17:34', '2024-09-27 19:20:49', '2024-09-29 07:17:34'),
	(31, 1, 'auth_token', NULL, '87ef03bc695a5d6b1761ef2b26448b728cc2867fd090a2551445b506748379fc', '["*"]', '2024-09-28 07:05:53', '2024-09-28 07:05:53', '2024-09-28 22:21:33', '2024-09-30 07:05:53'),
	(32, 1, 'auth_token', NULL, 'd59d46de0f90b33dabbe841d5bd658cd79639f47d1cdf4d4e1e1f559f908a6f7', '["*"]', '2024-09-28 22:21:50', '2024-09-28 22:21:50', '2024-09-29 02:04:49', '2024-09-30 22:21:50'),
	(33, 1, 'auth_token', NULL, '7f251a45e143e3048c77ba4f0d8fa5db7a0c05a7bfcf97c9f4619956c0d8205d', '["*"]', '2024-09-29 02:04:54', '2024-09-29 02:04:54', '2024-10-01 03:01:20', '2024-10-01 02:04:54'),
	(34, 1, 'auth_token', NULL, '5719d620fef3ea67d4bf37088b45a7bd93e9e6034e003b7c1fb8ca9a9d53e1a9', '["*"]', '2024-09-29 05:01:23', '2024-09-29 05:01:23', '2024-10-01 14:46:52', '2024-10-01 05:01:23'),
	(36, 1, 'auth_token', NULL, 'cbc5726353531f3153599f4a43579a69f0b5bef5140aa9b3194682806aa26ddf', '["*"]', '2024-10-01 04:37:36', '2024-10-01 04:37:36', '2024-10-02 09:07:47', '2024-10-03 04:37:36'),
	(37, 1, 'auth_token', NULL, '7d28e05c35922393aa54df4bec7339fafa91ed9c4b9f9b13026b126674f8e5fa', '["*"]', '2024-10-01 14:47:03', '2024-10-01 14:47:03', '2024-10-03 17:36:24', '2024-10-03 14:47:03'),
	(38, 1, 'auth_token', NULL, 'd8c60b3b954d6397dc404a34e1452d4a912dfb70ba260c699bbbdfff9cc23a39', '["*"]', '2024-10-02 09:07:53', '2024-10-02 09:07:53', '2024-10-03 18:36:45', '2024-10-04 09:07:53'),
	(39, 1, 'auth_token', NULL, '706abb22166d170be5c244a1fcf063d3ac8d4bb0cabc324e3173032f582f25d4', '["*"]', '2024-10-03 17:37:26', '2024-10-03 17:37:26', '2024-10-15 16:00:10', '2024-10-05 17:37:26'),
	(40, 1, 'auth_token', NULL, '4e7d2338e09ecd07d8c57ced492f3e262014c418eea6a458179ed5be4a3ab121', '["*"]', '2024-10-03 18:36:55', '2024-10-03 18:36:55', '2024-10-04 07:16:08', '2024-10-05 18:36:55'),
	(41, 1, 'auth_token', NULL, 'eebfe9163dbf7f5d29e23aa52316658e18d585bfb1835942ef40ba0f1d4c803e', '["*"]', '2024-10-04 07:16:17', '2024-10-04 07:16:17', '2024-10-05 01:49:19', '2024-10-06 07:16:17'),
	(42, 1, 'auth_token', NULL, '2c674fb8420d23da94432d5447579a3af734a80d528091bfc7ef0ada2910276a', '["*"]', '2024-10-05 01:49:28', '2024-10-05 01:49:28', '2024-10-05 06:28:29', '2024-10-07 01:49:28'),
	(44, 1, 'auth_token', NULL, 'a29dfcc37ac6fb4dca2641f18ab8f7698db35914640da787f4a9c887611a6dad', '["*"]', '2024-10-06 01:00:54', '2024-10-06 01:00:54', '2024-10-11 16:33:06', '2024-10-08 01:00:54'),
	(46, 1, 'auth_token', NULL, '83ce0527508d6ae449b473a24d21852b2b5b0e256e2a5c96e6faf181f9b12dc7', '["*"]', '2024-10-11 17:29:02', '2024-10-11 17:29:02', '2024-10-12 17:42:04', '2024-10-13 17:29:02'),
	(48, 1, 'auth_token', NULL, '1a76273f3d6aa8f3a7c5938da7ef407329c38d460d93759071854c04ac82f6a8', '["*"]', '2024-10-14 09:46:47', '2024-10-14 09:46:47', '2024-10-15 13:13:03', '2024-10-16 09:46:47'),
	(49, 1, 'auth_token', NULL, 'ed03d7f6afc922d21f0f051997ef487c1e1381e750f504dca214c36413154fc2', '["*"]', '2024-10-15 13:13:10', '2024-10-15 13:13:10', '2024-10-17 10:05:01', '2024-10-17 13:13:10'),
	(50, 1, 'auth_token', NULL, '5429f9da7f3af18e39722544a97720493919f28daf1664e3fe1933227ac707e8', '["*"]', '2024-10-17 10:05:08', '2024-10-17 10:05:08', '2024-10-17 17:18:46', '2024-10-19 10:05:08'),
	(51, 1, 'auth_token', NULL, '036a07889c3a795a9467492ac150af8c9a9ffdae87a1d5dc7c97347f7940d2ae', '["*"]', '2024-10-17 17:19:18', '2024-10-17 17:19:18', '2024-10-17 19:05:29', '2024-10-19 17:19:18');

-- Volcando estructura para tabla hotel.bitacora_anulaciones
CREATE TABLE IF NOT EXISTS `bitacora_anulaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `factura_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.bitacora_anulaciones: ~2 rows (aproximadamente)
INSERT INTO `bitacora_anulaciones` (`id`, `factura_id`, `user_id`, `motivo`, `fecha`) VALUES
	(1, 35, 1, 'MAL REGISTRO', '2024-10-03 07:19:31'),
	(2, 53, 1, 'PRUEBA DE ANULACION SISTEMA', '2024-10-04 04:46:29'),
	(3, 58, 1, 'ERROR EN FACTURACION SISTEMA', '2024-10-05 02:39:18'),
	(4, 54, 1, 'SE FACTURO INCORRECTAMENTE EL SERVICIO', '2024-10-05 13:03:10');

-- Volcando estructura para vista hotel.cajas
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `cajas` (
	`id_apertura` INT(10) UNSIGNED NOT NULL,
	`id_arqueo` INT(10) UNSIGNED NULL,
	`user_id` INT(10) UNSIGNED NULL,
	`usuario` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`fecha_apertura` DATETIME NOT NULL,
	`observaciones` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`monto` FLOAT(8,2) NOT NULL,
	`estado` VARCHAR(8) NOT NULL COLLATE 'utf8mb4_general_ci',
	`fecha_arqueo` DATETIME NULL,
	`monto_arqueo` FLOAT(8,2) NULL,
	`anulado` TINYINT(1) NULL,
	`fecha_cierre` DATETIME NULL,
	`monto_sistema` FLOAT(8,2) NULL,
	`existe_cierre` INT(1) NOT NULL,
	`observacionesCierre` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`aplicaCierre` INT(1) NULL
) ENGINE=MyISAM;

-- Volcando estructura para tabla hotel.cierre_caja
CREATE TABLE IF NOT EXISTS `cierre_caja` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `arqueo_id` int(10) unsigned DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `monto_sistema` float(8,2) NOT NULL,
  `observaciones` varchar(255) NOT NULL,
  `anulado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `cierre_caja_user_id_foreign` (`user_id`),
  KEY `cierre_caja_arqueo_id_foreign` (`arqueo_id`),
  CONSTRAINT `cierre_caja_arqueo_id_foreign` FOREIGN KEY (`arqueo_id`) REFERENCES `arqueo_caja` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cierre_caja_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.cierre_caja: ~0 rows (aproximadamente)
INSERT INTO `cierre_caja` (`id`, `user_id`, `arqueo_id`, `fecha`, `monto_sistema`, `observaciones`, `anulado`) VALUES
	(2, 1, 1, '2024-09-28 08:49:58', 2420.00, 'Se tuvo un sobrante de 30 quetzales debido a que no se registro una venta.', 0),
	(3, 1, 2, '2024-09-28 23:11:21', 1015.00, 'SE OLVIDO INGRESAR UNA VENTA', 0);

-- Volcando estructura para tabla hotel.clases_habitaciones
CREATE TABLE IF NOT EXISTS `clases_habitaciones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.clases_habitaciones: ~3 rows (aproximadamente)
INSERT INTO `clases_habitaciones` (`id`, `nombre`, `anulado`) VALUES
	(1, 'SENCILLA', 0),
	(2, 'ESTANDAR', 0),
	(3, 'PREMIUM', 0);

-- Volcando estructura para tabla hotel.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `tipo_documento` enum('NIT','CUI','IDE') NOT NULL,
  `num_documento` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `clientes_user_id_foreign` (`user_id`),
  CONSTRAINT `clientes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.clientes: ~37 rows (aproximadamente)
INSERT INTO `clientes` (`id`, `user_id`, `tipo_documento`, `num_documento`, `nombre`, `telefono`, `direccion`, `activo`) VALUES
	(1, 1, 'NIT', 'CF', 'HUGO RAUL LOPEZ ENRQUEZ', '41108778', '4ta calle zona 1 calle principal santa elena flores peten a un costado de banco industrial', 0),
	(3, 2, 'NIT', 'CF', 'MELISSA AYDARI GOMEZ', '43557289', 'BARRIO LA PAZ SAN BENITO', 1),
	(4, NULL, 'NIT', '110060008', 'Hugo Lopez', '41108778', 'Santa elena flores peten gt', 1),
	(5, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(6, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(7, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(8, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(9, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(10, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(11, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(12, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(13, NULL, 'NIT', '110060008', 'Hugo Lopez 2', '41108778', 'Santa elena flores peten gt', 1),
	(14, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(15, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(16, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(17, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(18, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(19, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(20, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(21, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(22, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(23, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(24, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(25, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(26, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(27, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(28, NULL, 'NIT', '114957703', 'Miriam Reynoso', '41108778', 'santa elena peten', 1),
	(29, NULL, 'NIT', '114957703', 'Dimitri Gomez', '41108778', 'SANTA ELENA PETEN GUATEMALA', 1),
	(30, NULL, 'NIT', '114957703', 'Dimitri Gomez', '41108778', 'SANTA ELENA PETEN GUATEMALA', 1),
	(31, NULL, 'NIT', '114957703', 'Dimitri Gomez', '41108778', 'SANTA ELENA PETEN GUATEMALA', 1),
	(32, NULL, 'NIT', 'CF', 'Damaris', '45125566', 'SAN BENITO PETEN', 1),
	(33, NULL, 'NIT', 'CF', 'Jorge giovanni lopez enriquez', '54112254', 'Santa Ana, Petén', 1),
	(34, NULL, 'NIT', 'CF', 'María José Morales', '74558721', 'La candelaria, san benito, petén', 1),
	(35, NULL, 'NIT', 'CF', 'Alexis Calderón', '51223364', 'SAN FRANCISCO PETEN', 1),
	(36, NULL, 'NIT', 'CF', 'JOSE MANUEL', '88561233', 'EL CHAL', 1),
	(37, NULL, 'NIT', 'CF', 'ROBIN SALAZAR', '45223687', 'LAS POZAS SAYAXCHE', 1),
	(38, NULL, 'NIT', 'CF', 'Emila Echeverría', '45112366', 'FRENTE A ESCUELA NORMAL SANTA ELENA PETEN', 1),
	(39, NULL, 'NIT', 'CF', 'Raúl Enriquez', '45758309', 'SAN BENITO, BARRIO EL PORVENIR, PETEN GT', 1);

-- Volcando estructura para tabla hotel.detalle_facturas
CREATE TABLE IF NOT EXISTS `detalle_facturas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `factura_id` int(10) unsigned DEFAULT NULL,
  `producto_id` int(10) unsigned DEFAULT NULL,
  `cantidad` float(8,2) NOT NULL,
  `costo` float(8,2) NOT NULL,
  `precio_venta` float(8,2) NOT NULL,
  `descuento` float(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `detalle_facturas_factura_id_foreign` (`factura_id`),
  KEY `detalle_facturas_producto_id_foreign` (`producto_id`),
  CONSTRAINT `detalle_facturas_factura_id_foreign` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_facturas_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.detalle_facturas: ~63 rows (aproximadamente)
INSERT INTO `detalle_facturas` (`id`, `factura_id`, `producto_id`, `cantidad`, `costo`, `precio_venta`, `descuento`) VALUES
	(83, 33, 1, 1.00, 1.00, 1100.00, 0.00),
	(84, 33, 7, 1.00, 30.00, 60.00, 0.00),
	(85, 33, 3, 1.00, 12.00, 19.00, 0.00),
	(86, 34, 1, 1.00, 1.00, 1200.00, 0.00),
	(87, 34, 3, 1.00, 12.00, 19.00, 0.00),
	(88, 35, 1, 1.00, 1.00, 1200.00, 0.00),
	(89, 35, 3, 1.00, 12.00, 19.00, 0.00),
	(90, 36, 1, 1.00, 1.00, 1200.00, 0.00),
	(91, 36, 3, 1.00, 12.00, 19.00, 0.00),
	(92, 37, 1, 1.00, 1.00, 1100.00, 0.00),
	(93, 37, 4, 1.00, 20.00, 35.00, 0.00),
	(94, 38, 1, 1.00, 1.00, 1100.00, 0.00),
	(95, 38, 4, 1.00, 20.00, 35.00, 0.00),
	(96, 39, 1, 1.00, 1.00, 1200.00, 0.00),
	(97, 39, 6, 1.00, 30.00, 70.00, 0.00),
	(98, 40, 1, 1.00, 1.00, 1100.00, 0.00),
	(99, 40, 3, 2.00, 12.00, 19.00, 5.00),
	(100, 40, 5, 1.00, 20.00, 50.00, 0.00),
	(101, 41, 1, 1.00, 1.00, 1100.00, 0.00),
	(102, 41, 7, 1.00, 30.00, 60.00, 0.00),
	(103, 41, 4, 1.00, 20.00, 35.00, 0.00),
	(104, 41, 3, 1.00, 12.00, 19.00, 0.00),
	(105, 41, 3, 2.00, 12.00, 19.00, 3.00),
	(106, 42, 1, 1.00, 1.00, 1200.00, 0.00),
	(107, 42, 2, 1.00, 5.00, 10.00, 0.00),
	(108, 43, 1, 1.00, 1.00, 1100.00, 0.00),
	(109, 43, 3, 2.00, 12.00, 19.00, 0.00),
	(110, 44, 1, 1.00, 1.00, 1100.00, 0.00),
	(111, 44, 4, 1.00, 20.00, 35.00, 0.00),
	(112, 45, 1, 1.00, 1.00, 1200.00, 0.00),
	(113, 45, 7, 1.00, 30.00, 60.00, 0.00),
	(114, 46, 1, 1.00, 1.00, 1100.00, 0.00),
	(115, 46, 2, 2.00, 5.00, 10.00, 0.00),
	(116, 47, 1, 1.00, 1.00, 1200.00, 0.00),
	(117, 48, 1, 1.00, 1.00, 1100.00, 0.00),
	(118, 49, 1, 1.00, 1.00, 1100.00, 0.00),
	(119, 49, 2, 2.00, 5.00, 10.00, 5.00),
	(120, 49, 5, 1.00, 20.00, 50.00, 0.00),
	(121, 50, 1, 1.00, 1.00, 1100.00, 0.00),
	(122, 50, 4, 2.00, 20.00, 35.00, 0.00),
	(123, 50, 6, 1.00, 30.00, 70.00, 0.00),
	(124, 51, 1, 1.00, 1.00, 1200.00, 0.00),
	(125, 51, 2, 3.00, 5.00, 10.00, 0.00),
	(126, 51, 5, 2.00, 20.00, 50.00, 20.00),
	(127, 52, 1, 1.00, 1.00, 1200.00, 0.00),
	(128, 52, 3, 2.00, 12.00, 19.00, 0.00),
	(129, 52, 5, 3.00, 20.00, 50.00, 0.00),
	(130, 53, 1, 1.00, 1.00, 1200.00, 0.00),
	(131, 53, 8, 3.00, 3.20, 5.00, 0.00),
	(132, 54, 1, 1.00, 1.00, 985.00, 0.00),
	(133, 54, 4, 1.00, 20.00, 35.00, 0.00),
	(134, 54, 8, 1.00, 3.20, 5.00, 0.00),
	(135, 54, 3, 2.00, 12.00, 19.00, 8.00),
	(136, 54, 2, 4.00, 5.00, 10.00, 5.00),
	(137, 55, 1, 1.00, 1.00, 1000.00, 0.00),
	(138, 55, 6, 1.00, 30.00, 70.00, 15.00),
	(139, 55, 4, 2.00, 20.00, 35.00, 0.00),
	(140, 55, 8, 3.00, 3.20, 5.00, 2.00),
	(141, 55, 3, 4.00, 12.00, 19.00, 6.00),
	(142, 56, 1, 1.00, 1.00, 985.00, 0.00),
	(143, 56, 4, 1.00, 20.00, 35.00, 0.00),
	(144, 57, 6, 1.00, 30.00, 70.00, 0.00),
	(145, 57, 1, 1.00, 1.00, 1100.00, 0.00),
	(146, 58, 1, 1.00, 1.00, 985.00, 0.00),
	(147, 58, 7, 1.00, 30.00, 60.00, 0.00);

-- Volcando estructura para tabla hotel.detalle_hospedajes
CREATE TABLE IF NOT EXISTS `detalle_hospedajes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hospedaje_id` int(10) unsigned DEFAULT NULL,
  `producto_id` int(10) unsigned DEFAULT NULL,
  `cantidad` float(8,2) NOT NULL,
  `costo` float(8,2) NOT NULL,
  `precio_venta` float(8,2) NOT NULL,
  `descuento` float(8,2) NOT NULL,
  `pagado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `detalle_hospedajes_hospedaje_id_foreign` (`hospedaje_id`),
  KEY `detalle_hospedajes_producto_id_foreign` (`producto_id`),
  CONSTRAINT `detalle_hospedajes_hospedaje_id_foreign` FOREIGN KEY (`hospedaje_id`) REFERENCES `hospedajes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_hospedajes_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.detalle_hospedajes: ~58 rows (aproximadamente)
INSERT INTO `detalle_hospedajes` (`id`, `hospedaje_id`, `producto_id`, `cantidad`, `costo`, `precio_venta`, `descuento`, `pagado`) VALUES
	(1, 2, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(13, 2, 2, 2.00, 5.00, 10.00, 0.00, 0),
	(14, 3, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(15, 3, 3, 1.00, 12.00, 19.00, 0.00, 0),
	(16, 4, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(17, 4, 7, 1.00, 30.00, 60.00, 0.00, 0),
	(18, 4, 3, 1.00, 12.00, 19.00, 0.00, 0),
	(19, 5, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(20, 5, 3, 1.00, 12.00, 19.00, 0.00, 0),
	(21, 6, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(22, 6, 3, 1.00, 12.00, 19.00, 0.00, 0),
	(23, 7, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(24, 7, 4, 1.00, 20.00, 35.00, 0.00, 0),
	(25, 8, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(26, 8, 6, 1.00, 30.00, 70.00, 0.00, 0),
	(27, 9, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(28, 9, 3, 2.00, 12.00, 19.00, 5.00, 0),
	(29, 9, 5, 1.00, 20.00, 50.00, 0.00, 0),
	(30, 10, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(31, 10, 7, 1.00, 30.00, 60.00, 0.00, 0),
	(32, 10, 4, 1.00, 20.00, 35.00, 0.00, 0),
	(33, 10, 3, 1.00, 12.00, 19.00, 0.00, 0),
	(34, 10, 3, 2.00, 12.00, 19.00, 3.00, 0),
	(35, 11, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(36, 11, 2, 1.00, 5.00, 10.00, 0.00, 0),
	(37, 12, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(38, 12, 3, 2.00, 12.00, 19.00, 0.00, 0),
	(39, 13, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(40, 13, 4, 1.00, 20.00, 35.00, 0.00, 0),
	(41, 14, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(42, 14, 7, 1.00, 30.00, 60.00, 0.00, 0),
	(43, 15, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(44, 15, 2, 2.00, 5.00, 10.00, 0.00, 0),
	(45, 16, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(46, 17, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(47, 18, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(48, 18, 2, 2.00, 5.00, 10.00, 5.00, 0),
	(49, 18, 5, 1.00, 20.00, 50.00, 0.00, 0),
	(50, 19, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(51, 19, 4, 2.00, 20.00, 35.00, 0.00, 0),
	(52, 19, 6, 1.00, 30.00, 70.00, 0.00, 0),
	(53, 20, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(54, 20, 2, 3.00, 5.00, 10.00, 0.00, 0),
	(55, 20, 5, 2.00, 20.00, 50.00, 20.00, 0),
	(56, 21, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(57, 21, 3, 2.00, 12.00, 19.00, 0.00, 0),
	(58, 21, 5, 3.00, 20.00, 50.00, 0.00, 0),
	(59, 22, 1, 1.00, 1.00, 1200.00, 0.00, 0),
	(61, 22, 8, 3.00, 3.20, 5.00, 0.00, 0),
	(62, 23, 1, 1.00, 1.00, 985.00, 0.00, 0),
	(63, 23, 4, 1.00, 20.00, 35.00, 0.00, 0),
	(64, 23, 8, 1.00, 3.20, 5.00, 0.00, 0),
	(65, 23, 3, 2.00, 12.00, 19.00, 8.00, 0),
	(66, 23, 2, 4.00, 5.00, 10.00, 5.00, 0),
	(67, 24, 1, 1.00, 1.00, 1000.00, 0.00, 0),
	(68, 24, 6, 1.00, 30.00, 70.00, 15.00, 0),
	(69, 24, 4, 2.00, 20.00, 35.00, 0.00, 0),
	(70, 24, 8, 3.00, 3.20, 5.00, 2.00, 0),
	(71, 24, 3, 4.00, 12.00, 19.00, 6.00, 0),
	(72, 25, 1, 1.00, 1.00, 985.00, 0.00, 0),
	(73, 25, 4, 1.00, 20.00, 35.00, 0.00, 0),
	(74, 26, 1, 1.00, 1.00, 1100.00, 0.00, 0),
	(75, 26, 6, 1.00, 30.00, 70.00, 0.00, 0),
	(76, 27, 1, 1.00, 1.00, 985.00, 0.00, 0),
	(77, 27, 7, 1.00, 30.00, 60.00, 0.00, 0);

-- Volcando estructura para tabla hotel.facturas
CREATE TABLE IF NOT EXISTS `facturas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hospedaje_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `num_factura` int(11) NOT NULL,
  `nit` varchar(255) DEFAULT NULL,
  `nombre_facturado` varchar(255) DEFAULT NULL,
  `direccion_facturado` varchar(255) DEFAULT NULL,
  `numero_fel` varchar(255) DEFAULT NULL,
  `serie_fel` varchar(255) DEFAULT NULL,
  `autorizacion_fel` varchar(255) DEFAULT NULL,
  `emision_fel` datetime DEFAULT NULL,
  `certificacion_fel` datetime DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `total` float(8,2) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `facturas_hospedaje_id_foreign` (`hospedaje_id`),
  KEY `facturas_user_id_foreign` (`user_id`),
  CONSTRAINT `facturas_hospedaje_id_foreign` FOREIGN KEY (`hospedaje_id`) REFERENCES `hospedajes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `facturas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.facturas: ~25 rows (aproximadamente)
INSERT INTO `facturas` (`id`, `hospedaje_id`, `user_id`, `num_factura`, `nit`, `nombre_facturado`, `direccion_facturado`, `numero_fel`, `serie_fel`, `autorizacion_fel`, `emision_fel`, `certificacion_fel`, `fecha_registro`, `total`, `anulado`) VALUES
	(33, 4, 1, 1, '105290688', 'SALAZAR,PINTO,,ROBIN,ISRAEL', ' ', '595152718', 'DB64219A', 'DB64219A-2379-4F4E-B614-C6ECA75B4267', NULL, NULL, '2024-09-14 11:27:43', 1179.00, 1),
	(34, 5, 1, 2, 'CF', 'CONSUMIDOR FINAL', 'CIUDAD', NULL, NULL, NULL, NULL, NULL, '2024-09-14 11:33:04', 1219.00, 1),
	(35, 5, 1, 3, 'CF', 'CONSUMIDOR FINAL', 'CIUDAD', NULL, NULL, NULL, NULL, NULL, '2024-09-14 11:39:40', 1219.00, 1),
	(36, 6, 1, 4, '119828464', 'LÓPEZ,ENRIQUEZ,,JORGE,GIOVANNI', ' ', NULL, NULL, NULL, NULL, NULL, '2024-09-14 12:26:33', 1219.00, 0),
	(37, 7, 1, 5, '119828464', 'LÓPEZ,ENRIQUEZ,,JORGE,GIOVANNI', ' ', NULL, NULL, NULL, NULL, NULL, '2024-09-14 12:49:47', 1135.00, 0),
	(38, 7, 1, 6, '119828464', 'LÓPEZ,ENRIQUEZ,,JORGE,GIOVANNI', ' ', NULL, NULL, NULL, NULL, NULL, '2024-09-14 12:50:37', 1135.00, 0),
	(39, 8, 1, 7, 'CF', 'CONSUMIDOR FINAL', 'CIUDAD', '3458027487', '49BDD8A2', '49BDD8A2-CE1D-4FDF-ABFD-3211574264BA', NULL, NULL, '2024-09-14 13:22:22', 1270.00, 0),
	(40, 9, 1, 8, '105290688', 'SALAZAR,PINTO,,ROBIN,ISRAEL', ' ', '512573941', '2B3758BA', '2B3758BA-1E8D-41F5-99A8-57455AAFD3ED', NULL, NULL, '2024-09-14 14:24:43', 1188.00, 0),
	(41, 10, 1, 9, '115919562', 'OCHOA,JACINTO,,VICTOR,ALEJANDRO', ' ', '1090995502', '390FB73D', '390FB73D-4107-452E-8CDE-0279C40E299C', NULL, NULL, '2024-09-16 15:39:14', 1249.00, 0),
	(42, 11, 1, 10, '114957703', 'SS SUPER SISTEMAS', ' ', '1965969361', '78909E6C', '78909E6C-752E-4FD1-8B4A-246A533FBC2F', NULL, NULL, '2024-09-16 15:50:55', 1210.00, 1),
	(43, 12, 1, 11, '114957703', 'SS SUPER SISTEMAS', ' ', '718949131', '9CB6E869', '9CB6E869-2ADA-4B0B-AEF1-0FA9713600CF', NULL, NULL, '2024-09-16 18:46:32', 1138.00, 0),
	(44, 13, 1, 12, 'CF', 'MELISSA AYDARI GOMEZ', 'BARRIO LA PAZ SAN BENITO', '1475628772', '937828FA', '937828FA-57F4-4EE4-9C74-3B0262E7988C', NULL, NULL, '2024-09-21 05:27:45', 1135.00, 0),
	(45, 14, 1, 13, 'CF', 'MELISSA AYDARI GOMEZ', 'BARRIO LA PAZ SAN BENITO', '337529606', '12927B61', '12927B61-141E-4B06-848B-CCD010E1DBA3', NULL, NULL, '2024-09-21 16:23:12', 1260.00, 0),
	(46, 15, 1, 14, 'CF', 'HUGO RAUL LOPEZ ENRQUEZ', '4ta calle zona 1 calle principal santa elena flores peten a un costado de banco industrial', '4291710146', 'C132707C', 'C132707C-FFCE-4CC2-8B05-894AC836452C', NULL, NULL, '2024-09-21 16:32:51', 1120.00, 0),
	(47, 16, 1, 15, 'CF', 'HUGO RAUL LOPEZ ENRQUEZ', '4ta calle zona 1 calle principal santa elena flores peten a un costado de banco industrial', '3877457762', '45A5BD41', '45A5BD41-E71D-4F62-B9DA-E700FF8D2922', NULL, NULL, '2024-09-21 16:38:40', 1200.00, 0),
	(48, 17, 1, 16, 'CF', 'HUGO RAUL LOPEZ ENRQUEZ', '4ta calle zona 1 calle principal santa elena flores peten a un costado de banco industrial', '4011151007', '775E2195', '775E2195-EF15-4E9F-ABE7-6A4ED5233759', NULL, NULL, '2024-09-21 16:41:01', 1100.00, 0),
	(49, 18, 1, 17, '108305449', 'CHÁVEZ,MISS,,JOSÉ,MANUEL', ' ', '2801353603', '39E06F3C', '39E06F3C-A6F9-4383-B984-BEFF18DFC74A', NULL, NULL, '2024-09-21 17:12:54', 1165.00, 0),
	(50, 19, 1, 18, '119828464', 'LÓPEZ,ENRIQUEZ,,JORGE,GIOVANNI', ' ', '2951563350', '882B6669', '882B6669-AFED-4856-9C10-4486F5E2D926', NULL, NULL, '2024-09-28 16:28:55', 1240.00, 0),
	(51, 20, 1, 19, '82228108', 'ZEPEDA,REYES,,FRANCISCO,JAVIER', ' ', '2039434221', '5BB7B69D', '5BB7B69D-798F-4BED-8E49-A2A8A8CB07BA', NULL, NULL, '2024-09-28 17:06:26', 1310.00, 0),
	(52, 21, 1, 20, '119828464', 'LÓPEZ,ENRIQUEZ,,JORGE,GIOVANNI', ' ', '2200584254', 'EC162F6A', 'EC162F6A-832A-403E-BE3E-BE9DE61DC46E', NULL, NULL, '2024-09-30 16:42:10', 1388.00, 0),
	(53, 22, 1, 21, 'CF', 'MELISSA AYDARI GOMEZ', 'BARRIO LA PAZ SAN BENITO', '604588730', 'B8023D4E', 'B8023D4E-2409-4ABA-AA22-6EB9EC264061', NULL, NULL, '2024-10-04 04:32:16', 1215.00, 1),
	(54, 23, 1, 22, '105290688', 'SALAZAR,PINTO,,ROBIN,ISRAEL', ' ', '1884573594', 'E9754A4D', 'E9754A4D-7054-4F9A-91DA-036888DD6F2F', NULL, NULL, '2024-10-05 07:25:00', 1090.00, 1),
	(55, 24, 1, 23, 'CF', 'HUGO RAUL LOPEZ ENRQUEZ', '4ta calle zona 1 calle principal santa elena flores peten a un costado de banco industrial', '4122689767', '7AF10DBF', '7AF10DBF-F5BB-40E7-80B8-AE652F87F4DB', NULL, NULL, '2024-10-05 08:16:00', 1208.00, 0),
	(56, 25, 1, 24, 'CF', 'MELISSA AYDARI GOMEZ', 'BARRIO LA PAZ SAN BENITO', '3163769548', '06DD7CF7', '06DD7CF7-BC93-4ACC-A09B-0C8952386FD8', NULL, NULL, '2024-10-05 08:22:00', 1020.00, 0),
	(57, 26, 1, 25, 'CF', 'MELISSA AYDARI GOMEZ', 'BARRIO LA PAZ SAN BENITO', '2601144314', '5D0E1712', '5D0E1712-9B0A-4FFA-8D0E-11FCD321F537', NULL, NULL, '2024-10-05 08:25:00', 1170.00, 0),
	(58, 27, 1, 26, 'CF', 'MELISSA AYDARI GOMEZ', 'BARRIO LA PAZ SAN BENITO', '2649640743', '5B9C50E1', '5B9C50E1-9DEE-4F27-BB11-1818C4379DCE', NULL, NULL, '2024-10-05 08:26:00', 1045.00, 1);

-- Volcando estructura para tabla hotel.gastos
CREATE TABLE IF NOT EXISTS `gastos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `tipo_gasto_id` int(10) unsigned DEFAULT NULL,
  `proveedor_id` int(10) unsigned DEFAULT NULL,
  `descripcion` varchar(255) NOT NULL,
  `monto` float(8,2) NOT NULL,
  `fecha` date NOT NULL,
  `anulado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `gastos_user_id_foreign` (`user_id`),
  KEY `gastos_tipo_gasto_id_foreign` (`tipo_gasto_id`),
  KEY `gastos_proveedor_id_foreign` (`proveedor_id`),
  CONSTRAINT `gastos_proveedor_id_foreign` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gastos_tipo_gasto_id_foreign` FOREIGN KEY (`tipo_gasto_id`) REFERENCES `tipogastos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gastos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.gastos: ~10 rows (aproximadamente)
INSERT INTO `gastos` (`id`, `user_id`, `tipo_gasto_id`, `proveedor_id`, `descripcion`, `monto`, `fecha`, `anulado`) VALUES
	(1, 1, 1, 1, 'PAGO DE ENVIO DE COMPUTADORA', 120.00, '2024-09-13', 1),
	(2, 1, 2, 2, 'ESCOBA', 20.00, '2024-08-15', 0),
	(3, 1, 2, 2, 'DESINFECTANTES', 45.00, '2024-09-03', 0),
	(4, 1, 2, 2, 'PAPEL', 200.00, '2024-09-18', 0),
	(5, 1, 2, 2, 'MESA', 450.00, '2024-09-03', 0),
	(6, 1, 1, 1, 'ENVIO DE MUEBLE', 100.00, '2024-08-01', 0),
	(7, 1, 2, 2, 'PAGO JABON Y DESINFECTANTE', 65.00, '2024-09-21', 0),
	(8, 1, 1, 1, 'PAGO JABON Y DESINFECTANTE', 50.00, '2024-09-22', 0),
	(9, 1, 2, 2, 'COMPRA DE LIMPIAVIDRIOS', 35.00, '2024-09-28', 0),
	(10, 1, 2, 2, 'COMPRA DE JABON', 20.00, '2024-09-28', 0),
	(11, 1, 1, 1, 'TECLADO', 100.00, '2024-10-11', 0);

-- Volcando estructura para tabla hotel.habitaciones
CREATE TABLE IF NOT EXISTS `habitaciones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `nivel_id` int(10) unsigned NOT NULL,
  `clase_habitacion_id` int(10) unsigned NOT NULL,
  `precio` float(8,2) NOT NULL,
  `tarifa` float(8,2) NOT NULL,
  `estado` enum('D','O','L') NOT NULL,
  `numero_personas` int(11) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `habitaciones_nivel_id_foreign` (`nivel_id`),
  KEY `habitaciones_clase_habitacion_id_foreign` (`clase_habitacion_id`),
  CONSTRAINT `habitaciones_clase_habitacion_id_foreign` FOREIGN KEY (`clase_habitacion_id`) REFERENCES `clases_habitaciones` (`id`),
  CONSTRAINT `habitaciones_nivel_id_foreign` FOREIGN KEY (`nivel_id`) REFERENCES `niveles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.habitaciones: ~4 rows (aproximadamente)
INSERT INTO `habitaciones` (`id`, `nombre`, `nivel_id`, `clase_habitacion_id`, `precio`, `tarifa`, `estado`, `numero_personas`, `anulado`) VALUES
	(1, 'H1', 1, 1, 1100.00, 12.00, 'D', 4, 0),
	(2, 'H2', 1, 1, 1200.00, 12.00, 'D', 4, 0),
	(3, 'H3', 1, 1, 985.00, 12.00, 'D', 2, 0),
	(4, 'H11', 2, 1, 1000.00, 12.00, 'D', 3, 0),
	(5, 'H12', 2, 1, 1150.00, 12.00, 'D', 3, 0);

-- Volcando estructura para tabla hotel.hoja_vida_productos
CREATE TABLE IF NOT EXISTS `hoja_vida_productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT '',
  `movimiento_id` int(11) NOT NULL DEFAULT 0,
  `existencia_anterior` float NOT NULL DEFAULT 0,
  `cantidad` float NOT NULL DEFAULT 0,
  `existencia_actual` float NOT NULL DEFAULT 0,
  `detalle` varchar(255) NOT NULL,
  `costo` float NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.hoja_vida_productos: ~20 rows (aproximadamente)
INSERT INTO `hoja_vida_productos` (`id`, `producto_id`, `user_id`, `fecha`, `tipo`, `movimiento_id`, `existencia_anterior`, `cantidad`, `existencia_actual`, `detalle`, `costo`) VALUES
	(1, 8, 1, '2024-10-04 03:15:10', 'IS', 8, 0, 15, 15, 'Ingreso al sistema', 3.25),
	(2, 8, 1, '2024-10-04 03:23:01', 'AE', 8, 15, 5, 20, 'Actualización de existencia', 3.25),
	(3, 8, 1, '2024-10-04 03:23:38', 'AE', 8, 20, 8, 12, 'Actualización de existencia', 3.2),
	(4, 4, 1, '2024-10-04 03:25:08', 'AE', 4, 75, 1, 76, 'Actualización de existencia', 20),
	(5, 8, 1, '2024-10-04 03:55:10', 'CH', 22, 12, 2, 10, 'Consumo en hospedaje #22 habitación "H2", cliente MELISSA AYDARI GOMEZ', 3.2),
	(6, 8, 1, '2024-10-04 04:07:05', 'ECH', 22, 10, 2, 12, 'Eliminación de consumo en hospedaje #22 habitación "H2", cliente MELISSA AYDARI GOMEZ', 3.2),
	(7, 8, 1, '2024-10-04 04:31:51', 'CH', 22, 12, 3, 9, 'Consumo en hospedaje #22 habitación "H2", cliente MELISSA AYDARI GOMEZ', 3.2),
	(8, 8, 1, '2024-10-04 04:46:29', 'AFH', 53, 9, 3, 12, 'Anulación de factura 21 por motivo: PRUEBA DE ANULACION SISTEMA', 3.2),
	(9, 4, 1, '2024-10-05 00:30:07', 'CH', 23, 76, 1, 75, 'Consumo en hospedaje #23 habitación "H3", cliente MELISSA AYDARI GOMEZ', 20),
	(10, 8, 1, '2024-10-05 00:30:16', 'CH', 23, 12, 1, 11, 'Consumo en hospedaje #23 habitación "H3", cliente MELISSA AYDARI GOMEZ', 3.2),
	(11, 3, 1, '2024-10-05 01:24:40', 'CH', 23, 29, 2, 27, 'Consumo en hospedaje #23 habitación "H3", cliente MELISSA AYDARI GOMEZ', 12),
	(12, 2, 1, '2024-10-05 01:24:54', 'CH', 23, 90, 4, 86, 'Consumo en hospedaje #23 habitación "H3", cliente MELISSA AYDARI GOMEZ', 5),
	(13, 4, 1, '2024-10-05 02:16:03', 'CH', 24, 75, 2, 73, 'Consumo en hospedaje #24 habitación "H11", cliente HUGO RAUL LOPEZ ENRQUEZ', 20),
	(14, 8, 1, '2024-10-05 02:16:11', 'CH', 24, 11, 3, 8, 'Consumo en hospedaje #24 habitación "H11", cliente HUGO RAUL LOPEZ ENRQUEZ', 3.2),
	(15, 3, 1, '2024-10-05 02:16:19', 'CH', 24, 27, 4, 23, 'Consumo en hospedaje #24 habitación "H11", cliente HUGO RAUL LOPEZ ENRQUEZ', 12),
	(16, 4, 1, '2024-10-05 02:21:55', 'CH', 25, 73, 1, 72, 'Consumo en hospedaje #25 habitación "H3", cliente MELISSA AYDARI GOMEZ', 20),
	(17, 4, 1, '2024-10-05 13:03:10', 'AFH', 54, 72, 1, 73, 'Anulación de factura 22 por motivo: SE FACTURO INCORRECTAMENTE EL SERVICIO', 20),
	(18, 8, 1, '2024-10-05 13:03:10', 'AFH', 54, 8, 1, 9, 'Anulación de factura 22 por motivo: SE FACTURO INCORRECTAMENTE EL SERVICIO', 3.2),
	(19, 3, 1, '2024-10-05 13:03:10', 'AFH', 54, 23, 2, 25, 'Anulación de factura 22 por motivo: SE FACTURO INCORRECTAMENTE EL SERVICIO', 12),
	(20, 2, 1, '2024-10-05 13:03:10', 'AFH', 54, 86, 4, 90, 'Anulación de factura 22 por motivo: SE FACTURO INCORRECTAMENTE EL SERVICIO', 5);

-- Volcando estructura para tabla hotel.hospedajes
CREATE TABLE IF NOT EXISTS `hospedajes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `reservacion_id` int(10) unsigned DEFAULT NULL,
  `habitacion_id` int(10) unsigned DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `total` float(8,2) NOT NULL,
  `monto_penalidad` float(8,2) NOT NULL DEFAULT 0.00,
  `facturado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `hospedajes_cliente_id_foreign` (`cliente_id`),
  KEY `hospedajes_user_id_foreign` (`user_id`),
  KEY `hospedajes_reservacion_id_foreign` (`reservacion_id`),
  KEY `hospedajes_habitacion_id_foreign` (`habitacion_id`),
  CONSTRAINT `hospedajes_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hospedajes_habitacion_id_foreign` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hospedajes_reservacion_id_foreign` FOREIGN KEY (`reservacion_id`) REFERENCES `reservaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hospedajes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.hospedajes: ~26 rows (aproximadamente)
INSERT INTO `hospedajes` (`id`, `cliente_id`, `user_id`, `reservacion_id`, `habitacion_id`, `fecha_inicio`, `fecha_fin`, `fecha_registro`, `total`, `monto_penalidad`, `facturado`) VALUES
	(2, 1, 1, 1, 1, '2024-09-12 19:27:56', '2024-09-13 07:27:56', '2024-09-12 19:38:29', 1100.00, 0.00, 1),
	(3, 1, 1, 2, 1, '2024-09-14 08:07:01', '2024-09-14 20:07:01', '2024-09-14 10:15:33', 1100.00, 0.00, 1),
	(4, 1, 1, NULL, 1, '2024-09-14 11:22:35', '2024-09-14 23:22:35', '2024-09-14 11:22:38', 1100.00, 0.00, 1),
	(5, 1, 1, NULL, 2, '2024-09-14 11:32:20', '2024-09-14 23:32:20', '2024-09-14 11:32:25', 1200.00, 0.00, 1),
	(6, 1, 1, NULL, 2, '2024-09-14 12:25:46', '2024-09-15 00:25:46', '2024-09-14 12:25:49', 1200.00, 0.00, 1),
	(7, 1, 1, NULL, 1, '2024-09-14 12:48:49', '2024-09-15 00:48:49', '2024-09-14 12:48:56', 1100.00, 0.00, 1),
	(8, 3, 1, NULL, 2, '2024-09-14 13:21:08', '2024-09-15 01:21:08', '2024-09-14 13:21:10', 1200.00, 0.00, 1),
	(9, 3, 1, NULL, 1, '2024-09-14 14:22:23', '2024-09-15 02:22:23', '2024-09-14 14:22:27', 1100.00, 0.00, 1),
	(10, 3, 1, NULL, 1, '2024-09-15 17:22:49', '2024-09-16 05:22:49', '2024-09-15 17:22:58', 1100.00, 0.00, 1),
	(11, 1, 1, NULL, 2, '2024-09-16 15:49:36', '2024-09-17 03:49:36', '2024-09-16 15:49:42', 1200.00, 0.00, 1),
	(12, 3, 1, NULL, 1, '2024-09-16 18:45:26', '2024-09-17 06:45:26', '2024-09-16 18:45:30', 1100.00, 0.00, 1),
	(13, 3, 1, NULL, 1, '2024-09-21 05:27:05', '2024-09-21 17:27:05', '2024-09-21 05:27:10', 1100.00, 0.00, 1),
	(14, 3, 1, NULL, 2, '2024-09-21 16:22:25', '2024-09-22 04:22:25', '2024-09-21 16:22:30', 1200.00, 0.00, 1),
	(15, 1, 1, NULL, 1, '2024-09-21 16:32:07', '2024-09-22 04:32:07', '2024-09-21 16:32:14', 1100.00, 0.00, 1),
	(16, 1, 1, NULL, 2, '2024-09-21 16:38:13', '2024-09-22 04:38:13', '2024-09-21 16:38:17', 1200.00, 0.00, 1),
	(17, 1, 1, NULL, 1, '2024-09-21 16:40:34', '2024-09-22 04:40:34', '2024-09-21 16:40:37', 1100.00, 0.00, 1),
	(18, 1, 1, NULL, 1, '2024-09-21 17:09:54', '2024-09-22 05:09:54', '2024-09-21 17:09:58', 1100.00, 0.00, 1),
	(19, 1, 1, 3, 1, '2024-09-28 08:07:36', '2024-09-28 20:07:36', '2024-09-28 16:27:35', 1100.00, 0.00, 1),
	(20, 1, 1, 5, 1, '2024-09-29 01:58:31', '2024-09-29 13:58:31', '2024-09-28 17:03:26', 1200.00, 0.00, 1),
	(21, 1, 1, 6, 2, '2024-09-30 16:38:32', '2024-10-01 04:38:32', '2024-09-30 16:39:14', 1200.00, 0.00, 1),
	(22, 3, 1, NULL, 2, '2024-10-04 03:28:18', '2024-10-04 15:28:18', '2024-10-04 03:29:23', 1200.00, 0.00, 1),
	(23, 3, 1, NULL, 3, '2024-10-05 00:29:46', '2024-10-05 12:29:46', '2024-10-05 00:29:50', 985.00, 0.00, 1),
	(24, 1, 1, NULL, 4, '2024-10-05 02:15:27', '2024-10-05 14:15:27', '2024-10-05 02:15:41', 1000.00, 0.00, 1),
	(25, 3, 1, NULL, 3, '2024-10-05 02:21:41', '2024-10-05 14:21:41', '2024-10-05 02:21:45', 985.00, 0.00, 1),
	(26, 3, 1, NULL, 1, '2024-10-05 02:25:24', '2024-10-05 14:25:24', '2024-10-05 02:25:27', 1100.00, 0.00, 1),
	(27, 3, 1, NULL, 3, '2024-10-05 02:26:15', '2024-10-05 14:26:15', '2024-10-05 02:26:19', 985.00, 0.00, 1);

-- Volcando estructura para tabla hotel.modulos
CREATE TABLE IF NOT EXISTS `modulos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.modulos: ~17 rows (aproximadamente)
INSERT INTO `modulos` (`id`, `nombre`) VALUES
	(1, 'Clientes'),
	(2, 'Reservaciones'),
	(3, 'CheckIn'),
	(4, 'Cajas'),
	(5, 'CheckOut'),
	(6, 'Niveles'),
	(7, 'ClasesHabitacion'),
	(8, 'Habitaciones'),
	(9, 'TiposGasto'),
	(10, 'Proveedores'),
	(11, 'Gastos'),
	(12, 'Usuarios'),
	(13, 'Productos'),
	(14, 'Dashboard'),
	(15, 'ReporteFacturacion'),
	(16, 'ReporteGastos'),
	(17, 'HojaVidaProductos');

-- Volcando estructura para tabla hotel.modulo_rol
CREATE TABLE IF NOT EXISTS `modulo_rol` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rol_id` int(10) unsigned DEFAULT NULL,
  `modulo_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `modulo_rol_rol_id_foreign` (`rol_id`),
  KEY `modulo_rol_modulo_id_foreign` (`modulo_id`),
  CONSTRAINT `modulo_rol_modulo_id_foreign` FOREIGN KEY (`modulo_id`) REFERENCES `modulos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `modulo_rol_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.modulo_rol: ~4 rows (aproximadamente)
INSERT INTO `modulo_rol` (`id`, `rol_id`, `modulo_id`) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(3, 1, 3),
	(4, 1, 5);

-- Volcando estructura para tabla hotel.niveles
CREATE TABLE IF NOT EXISTS `niveles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.niveles: ~0 rows (aproximadamente)
INSERT INTO `niveles` (`id`, `nombre`, `anulado`) VALUES
	(1, 'NIVEL 1', 0),
	(2, 'NIVEL 2', 0);

-- Volcando estructura para función hotel.obtenerInfoEstado
DELIMITER //
CREATE FUNCTION `obtenerInfoEstado`(id_habitacion INT, estado CHAR(1), fecha DATETIME) RETURNS int(11)
BEGIN
   DECLARE numeroHoras INT DEFAULT 0;
	
	IF estado='D' THEN
		SELECT TIMESTAMPDIFF(MINUTE, fecha, reservaciones.fecha_inicio) 
    	INTO numeroHoras
    	FROM reservaciones
		WHERE (TIMESTAMPDIFF(MINUTE, fecha, reservaciones.fecha_inicio)  < 1440)
		AND (TIMESTAMPDIFF(MINUTE, fecha, reservaciones.fecha_inicio)  > -1440)
		AND anulado=0 AND (habitacion_id=id_habitacion) LIMIT 1;
	ELSEIF estado ='O' THEN
		SELECT TIMESTAMPDIFF(MINUTE, reservaciones.fecha_fin , fecha) 
    	INTO numeroHoras
    	FROM reservaciones
		WHERE (TIMESTAMPDIFF(MINUTE, reservaciones.fecha_fin , fecha)  > 0)
		AND anulado=0 AND (habitacion_id=id_habitacion) LIMIT 1;
	END IF;

    RETURN numeroHoras;
END//
DELIMITER ;

-- Volcando estructura para función hotel.obtener_estado_habitacion
DELIMITER //
CREATE FUNCTION `obtener_estado_habitacion`(id_habitacion INT, fecha_hora_actual DATETIME) RETURNS char(1) CHARSET latin1 COLLATE latin1_swedish_ci
BEGIN
    DECLARE numeroMinutos INT DEFAULT 0;
    DECLARE estadoActual CHAR(1);

    -- Obtiene el estado actual de la habitación
    SELECT estado INTO estadoActual 
    FROM habitaciones 
    WHERE id = id_habitacion;

    -- Verifica si el estado es 'D' (Disponible)
    IF estadoActual = 'D' THEN
        SELECT COUNT(r.id)
        INTO numeroMinutos
        FROM reservaciones r
        JOIN habitaciones h ON r.habitacion_id = h.id
        WHERE h.id = id_habitacion 
          AND r.anulado = 0
          AND r.estado='creada'
          AND TIMESTAMPDIFF(MINUTE, fecha_hora_actual, r.fecha_inicio) < (
            SELECT tarifa * 60 FROM habitaciones WHERE id = id_habitacion
          )
        LIMIT 1;

        -- Si hay una reservación próxima en menos tiempo del que dura una estancia, devuelve 'R'
        IF numeroMinutos > 0 THEN
            RETURN 'R';
        ELSE
            RETURN 'D';
        END IF;

    -- Verifica si el estado es 'O' (Ocupada)
    ELSEIF estadoActual = 'O' THEN
        SELECT TIMESTAMPDIFF(MINUTE, r.fecha_fin, fecha_hora_actual)
        INTO numeroMinutos
        FROM reservaciones r
        WHERE r.habitacion_id = id_habitacion 
          AND r.anulado = 0
          AND TIMESTAMPDIFF(MINUTE, r.fecha_fin, fecha_hora_actual) > 0
        LIMIT 1;

        -- Si ha pasado más de un minuto desde la fecha_fin de la reservación, devuelve 'S'
        IF numeroMinutos IS NOT NULL AND numeroMinutos > 1 THEN
            RETURN 'S';
        ELSE
            RETURN 'O';
        END IF;

    ELSE
        RETURN estadoActual;
    END IF;
END//
DELIMITER ;

-- Volcando estructura para función hotel.obtener_opcion_pago
DELIMITER //
CREATE FUNCTION `obtener_opcion_pago`(`id_documento` INT,
	`tipo_doc` VARCHAR(255),
	`metodo_pago` VARCHAR(255)
) RETURNS float
BEGIN
    DECLARE monto FLOAT;
    
    SELECT monto INTO monto
    FROM opciones_pagos
    WHERE tipo_documento = tipo_doc AND metodo = metodo_pago AND documento_id = id_documento
    LIMIT 1;

    RETURN monto;
END//
DELIMITER ;

-- Volcando estructura para función hotel.obtener_reservacion_proxima
DELIMITER //
CREATE FUNCTION `obtener_reservacion_proxima`(id_habitacion INT, fecha_hora_actual DATETIME) RETURNS int(11)
BEGIN
    DECLARE idReservacion INT DEFAULT 0;

        SELECT r.id
        INTO idReservacion
        FROM reservaciones r
        JOIN habitaciones h ON r.habitacion_id = h.id
        WHERE h.id = id_habitacion 
          AND r.anulado = 0
          AND r.estado='creada'
          AND TIMESTAMPDIFF(MINUTE, fecha_hora_actual, r.fecha_inicio) < (
            SELECT tarifa * 60 FROM habitaciones WHERE id = id_habitacion
          )
        LIMIT 1;

        
        RETURN idReservacion;
END//
DELIMITER ;

-- Volcando estructura para tabla hotel.opciones_pagos
CREATE TABLE IF NOT EXISTS `opciones_pagos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `apertura_id` int(10) unsigned DEFAULT NULL,
  `tipo_documento` varchar(255) NOT NULL,
  `documento_id` int(11) NOT NULL,
  `metodo` varchar(255) NOT NULL,
  `monto` float(8,2) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `opciones_pagos_apertura_id_foreign` (`apertura_id`),
  CONSTRAINT `opciones_pagos_apertura_id_foreign` FOREIGN KEY (`apertura_id`) REFERENCES `apertura_caja` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.opciones_pagos: ~50 rows (aproximadamente)
INSERT INTO `opciones_pagos` (`id`, `apertura_id`, `tipo_documento`, `documento_id`, `metodo`, `monto`, `fecha`) VALUES
	(1, NULL, 'FG', 1, 'EFE', 100.00, '2024-09-13'),
	(2, NULL, 'FG', 1, 'TAR', 20.00, '2024-09-13'),
	(3, NULL, 'FH', 464, 'EFE', 1325.00, '2024-09-14'),
	(4, NULL, 'FH', 471, 'TAR', 1120.00, '2024-09-14'),
	(5, NULL, 'FH', 472, 'EFE', 1000.00, '2024-09-14'),
	(6, NULL, 'FH', 472, 'TAR', 119.00, '2024-09-14'),
	(7, NULL, 'FH', 1, 'EFE', 1179.00, '2024-09-14'),
	(8, NULL, 'FH', 7, 'TAR', 1270.00, '2024-09-14'),
	(9, NULL, 'FH', 8, 'EFE', 183.00, '2024-09-14'),
	(10, NULL, 'FH', 8, 'TAR', 1000.00, '2024-09-14'),
	(11, NULL, 'FG', 2, 'EFE', 20.00, '2024-09-15'),
	(12, NULL, 'FG', 3, 'TAR', 45.00, '2024-09-15'),
	(13, NULL, 'FG', 4, 'TAR', 200.00, '2024-09-15'),
	(14, NULL, 'FH', 9, 'EFE', 1249.00, '2024-09-16'),
	(15, NULL, 'FH', 10, 'EFE', 1210.00, '2024-09-16'),
	(16, NULL, 'FH', 11, 'EFE', 1138.00, '2024-09-16'),
	(17, 1, 'FG', 5, 'TAR', 450.00, '2024-09-20'),
	(18, NULL, 'FG', 6, 'EFE', 40.00, '2024-09-20'),
	(19, NULL, 'FG', 6, 'TAR', 60.00, '2024-09-20'),
	(20, NULL, 'FH', 12, 'EFE', 500.00, '2024-09-20'),
	(21, NULL, 'FH', 12, 'TAR', 635.00, '2024-09-20'),
	(22, 2, 'FG', 7, 'EFE', 30.00, '2024-09-21'),
	(23, 2, 'FG', 7, 'TAR', 35.00, '2024-09-21'),
	(24, 2, 'FH', 13, 'EFE', 1200.00, '2024-09-21'),
	(25, 2, 'FH', 13, 'TAR', 60.00, '2024-09-21'),
	(26, NULL, 'FH', 14, 'EFE', 600.00, '2024-09-21'),
	(27, NULL, 'FH', 14, 'TAR', 520.00, '2024-09-21'),
	(28, 2, 'FH', 15, 'EFE', 1000.00, '2024-09-21'),
	(29, 2, 'FH', 15, 'TAR', 200.00, '2024-09-21'),
	(30, 2, 'FH', 16, 'TAR', 1000.00, '2024-09-21'),
	(31, 2, 'FH', 16, 'EFE', 100.00, '2024-09-21'),
	(32, 2, 'FH', 17, 'EFE', 165.00, '2024-09-21'),
	(33, 2, 'FH', 17, 'TAR', 1000.00, '2024-09-21'),
	(34, 2, 'FG', 8, 'EFE', 15.00, '2024-09-21'),
	(35, 2, 'FG', 8, 'TRA', 10.00, '2024-09-21'),
	(36, 2, 'FG', 8, 'TAR', 10.00, '2024-09-21'),
	(37, 2, 'FG', 8, 'CHE', 15.00, '2024-09-21'),
	(38, 3, 'FG', 9, 'EFE', 35.00, '2024-09-28'),
	(39, 3, 'FH', 18, 'EFE', 740.00, '2024-09-28'),
	(40, 3, 'FH', 18, 'TAR', 500.00, '2024-09-28'),
	(41, 3, 'FH', 19, 'EFE', 310.00, '2024-09-28'),
	(42, 3, 'FH', 19, 'TAR', 1000.00, '2024-09-28'),
	(43, 3, 'FG', 10, 'TAR', 20.00, '2024-09-28'),
	(44, NULL, 'FH', 20, 'EFE', 1388.00, '2024-09-30'),
	(45, NULL, 'FH', 21, 'EFE', 1215.00, '2024-10-03'),
	(46, NULL, 'FH', 22, 'TAR', 1090.00, '2024-10-04'),
	(47, NULL, 'FH', 23, 'TAR', 1208.00, '2024-10-04'),
	(48, NULL, 'FH', 24, 'EFE', 1020.00, '2024-10-04'),
	(49, NULL, 'FH', 25, 'TAR', 1170.00, '2024-10-04'),
	(50, NULL, 'FH', 26, 'EFE', 1045.00, '2024-10-04'),
	(51, NULL, 'FG', 11, 'EFE', 100.00, '2024-10-11');

-- Volcando estructura para tabla hotel.pago_transacciones
CREATE TABLE IF NOT EXISTS `pago_transacciones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `checkout_id` varchar(255) NOT NULL DEFAULT '',
  `descripcion` text NOT NULL,
  `reservacion_id` int(10) unsigned NOT NULL DEFAULT 0,
  `fecha_registro` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `fecha_pagado` datetime DEFAULT '0000-00-00 00:00:00',
  `estado` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.pago_transacciones: ~12 rows (aproximadamente)
INSERT INTO `pago_transacciones` (`id`, `checkout_id`, `descripcion`, `reservacion_id`, `fecha_registro`, `fecha_pagado`, `estado`) VALUES
	(1, '-', 'Hospedaje de habitación H11, cliente: Miriam Reynoso , documento: 114957703', 23, '2024-10-12 19:38:16', NULL, 'Pendiente'),
	(2, '-', 'Hospedaje de habitación H3, cliente: Dimitri Gomez , documento: 114957703', 24, '2024-10-14 01:09:24', NULL, 'Pendiente'),
	(3, '-', 'Hospedaje de habitación H3, cliente: Dimitri Gomez , documento: 114957703', 25, '2024-10-14 01:11:05', NULL, 'Pendiente'),
	(4, 'ch_2naxdunxmjyftclq', 'Hospedaje de habitación H3, cliente: Dimitri Gomez , documento: 114957703', 26, '2024-10-14 01:23:28', NULL, 'Pendiente'),
	(5, 'ch_bxeago0gpefdbpvx', 'Hospedaje de habitación H1, cliente: Damaris , documento: CF', 27, '2024-10-14 01:24:40', '2024-10-14 01:27:24', 'Pagado'),
	(6, 'ch_6zcacykcxsiah42d', 'Hospedaje de habitación H1, cliente: Jorge giovanni lopez enriquez , documento: CF', 28, '2024-10-15 01:10:00', '2024-10-15 01:18:33', 'Pagado'),
	(7, 'ch_jg5tovkaxtpfwqgb', 'Hospedaje de habitación H11, cliente: María José Morales , documento: CF', 29, '2024-10-15 02:10:46', NULL, 'Pendiente'),
	(8, 'ch_3rx2aoi8i4xl1cih', 'Hospedaje de habitación H3, cliente: Alexis Calderón , documento: CF', 30, '2024-10-15 02:11:41', NULL, 'Pendiente'),
	(9, 'ch_htascjo9s5akdboe', 'Hospedaje de habitación H11, cliente: JOSE MANUEL , documento: CF', 31, '2024-10-15 02:17:50', NULL, 'Pendiente'),
	(10, 'ch_hndgsffotoozixcd', 'Hospedaje de habitación H1, cliente: ROBIN SALAZAR , documento: CF', 32, '2024-10-15 19:32:19', '2024-10-15 19:34:22', 'Pagado'),
	(11, 'ch_qltm6exm4t6ucq8m', 'Hospedaje de habitación H3, cliente: Emila Echeverría , documento: CF', 33, '2024-10-16 07:18:22', NULL, 'Pendiente'),
	(12, 'ch_ptuqjxb5o3e6idoi', 'Hospedaje de habitación H12, cliente: Raúl Enriquez , documento: CF', 34, '2024-10-16 22:04:50', '2024-10-16 22:08:16', 'Pagado');

-- Volcando estructura para tabla hotel.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `costo` float(8,2) NOT NULL,
  `precio_venta` float(8,2) NOT NULL,
  `existencia` float(8,2) NOT NULL,
  `es_servicio` tinyint(1) NOT NULL,
  `fecha_ingreso` datetime NOT NULL,
  `anulado` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.productos: ~8 rows (aproximadamente)
INSERT INTO `productos` (`id`, `codigo`, `nombre`, `costo`, `precio_venta`, `existencia`, `es_servicio`, `fecha_ingreso`, `anulado`) VALUES
	(1, 'S-1', 'HOSPEDAJE', 100.00, 1000.00, 1.00, 1, '2024-09-12 19:26:56', 1),
	(2, 'P1', 'JABON', 5.00, 10.00, 90.00, 0, '2024-09-13 04:46:57', 0),
	(3, 'P2', 'SHAMPOO', 12.00, 19.00, 25.00, 0, '2024-09-13 04:47:11', 0),
	(4, 'P3', 'TOALLA', 20.00, 35.00, 73.00, 0, '2024-09-13 04:47:25', 0),
	(5, 'P5', 'DESAYUNO', 20.00, 50.00, 1.00, 1, '2024-09-13 04:47:43', 0),
	(6, 'P6', 'ALMUERZO', 30.00, 70.00, 1.00, 1, '2024-09-13 04:48:05', 0),
	(7, 'P7', 'CENA', 30.00, 60.00, 1.00, 1, '2024-09-13 04:48:19', 0),
	(8, 'P8', 'BOTELLA AGUA 600ML', 3.20, 5.00, 9.00, 0, '2024-10-04 03:15:10', 0);

-- Volcando estructura para tabla hotel.proveedores
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nit` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.proveedores: ~0 rows (aproximadamente)
INSERT INTO `proveedores` (`id`, `nit`, `nombre`, `telefono`, `direccion`, `email`, `anulado`) VALUES
	(1, 'CF', 'GUATEX', NULL, NULL, NULL, 0),
	(2, 'CF', 'DESPENSA FAMILIAR', NULL, NULL, NULL, 0);

-- Volcando estructura para tabla hotel.reservaciones
CREATE TABLE IF NOT EXISTS `reservaciones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `habitacion_id` int(10) unsigned NOT NULL,
  `cliente_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `total` float(8,2) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `numero_adultos` int(11) NOT NULL,
  `numero_ninos` int(11) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `pagado` tinyint(1) DEFAULT 0,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `reservaciones_habitacion_id_foreign` (`habitacion_id`),
  KEY `reservaciones_cliente_id_foreign` (`cliente_id`),
  KEY `reservaciones_user_id_foreign` (`user_id`),
  CONSTRAINT `reservaciones_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `reservaciones_habitacion_id_foreign` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`),
  CONSTRAINT `reservaciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.reservaciones: ~28 rows (aproximadamente)
INSERT INTO `reservaciones` (`id`, `habitacion_id`, `cliente_id`, `user_id`, `total`, `estado`, `fecha_inicio`, `fecha_fin`, `fecha_registro`, `numero_adultos`, `numero_ninos`, `observaciones`, `pagado`, `anulado`) VALUES
	(1, 1, 1, 1, 1100.00, 'recepcionada', '2024-09-12 19:27:56', '2024-09-13 07:27:56', '2024-09-12 19:28:02', 1, 2, 'TRAERA DOS MALETAS PARA GUARDAR EN BODEGA', 0, 0),
	(2, 1, 1, 1, 1100.00, 'recepcionada', '2024-09-14 08:07:01', '2024-09-14 20:07:01', '2024-09-14 08:07:10', 1, 0, NULL, 0, 0),
	(3, 1, 1, 1, 1100.00, 'recepcionada', '2024-09-28 08:07:36', '2024-09-28 20:07:36', '2024-09-14 08:07:45', 1, 0, NULL, 0, 0),
	(4, 2, 1, 1, 1200.00, 'creada', '2024-10-21 00:59:12', '2024-10-21 12:59:12', '2024-10-16 00:59:52', 1, 1, NULL, 0, 0),
	(5, 1, 1, 1, 1200.00, 'recepcionada', '2024-09-29 01:58:31', '2024-09-29 13:58:31', '2024-09-22 01:58:54', 1, 1, NULL, 0, 0),
	(6, 2, 1, 1, 1200.00, 'recepcionada', '2024-09-30 16:38:32', '2024-10-01 04:38:32', '2024-09-30 16:38:39', 2, 1, NULL, 0, 0),
	(13, 4, 16, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:16:13', 3, 0, NULL, 0, 0),
	(14, 4, 19, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:20:24', 3, 0, NULL, 0, 0),
	(15, 4, 20, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:21:10', 3, 0, NULL, 0, 0),
	(16, 4, 21, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:21:34', 3, 0, NULL, 0, 0),
	(17, 4, 22, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:22:55', 3, 0, NULL, 0, 0),
	(18, 4, 23, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:23:19', 3, 0, NULL, 0, 0),
	(19, 4, 24, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:23:40', 3, 0, NULL, 0, 0),
	(20, 4, 25, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:27:39', 3, 0, NULL, 0, 0),
	(21, 4, 26, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:28:58', 3, 0, NULL, 0, 0),
	(22, 4, 27, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:31:52', 3, 0, NULL, 0, 0),
	(23, 4, 28, NULL, 1000.00, 'pendiente', '2024-10-15 15:00:00', '2024-10-16 11:00:00', '2024-10-12 19:38:15', 3, 0, NULL, 0, 0),
	(24, 3, 29, NULL, 985.00, 'pendiente', '2024-10-14 15:00:00', '2024-10-15 11:00:00', '2024-10-14 01:09:24', 1, 0, NULL, 0, 0),
	(25, 3, 30, NULL, 985.00, 'pendiente', '2024-10-14 15:00:00', '2024-10-15 11:00:00', '2024-10-14 01:11:05', 1, 0, NULL, 0, 0),
	(26, 3, 31, NULL, 985.00, 'pendiente', '2024-10-14 15:00:00', '2024-10-15 11:00:00', '2024-10-14 01:23:28', 1, 0, NULL, 0, 0),
	(27, 1, 32, NULL, 1100.00, 'pendiente', '2024-10-14 15:00:00', '2024-10-15 11:00:00', '2024-10-14 01:24:40', 1, 0, NULL, 0, 0),
	(28, 1, 33, NULL, 1100.00, 'creada', '2024-10-20 15:00:00', '2024-10-21 11:00:00', '2024-10-15 01:10:00', 3, 0, NULL, 1, 0),
	(29, 4, 34, NULL, 1000.00, 'pendiente', '2024-10-30 15:00:00', '2024-10-31 11:00:00', '2024-10-15 02:10:46', 1, 0, NULL, 0, 0),
	(30, 3, 35, NULL, 985.00, 'pendiente', '2024-10-25 15:00:00', '2024-10-26 11:00:00', '2024-10-15 02:11:41', 1, 0, NULL, 0, 0),
	(31, 4, 36, NULL, 1000.00, 'pendiente', '2024-10-27 15:00:00', '2024-10-28 11:00:00', '2024-10-15 02:17:50', 2, 0, NULL, 0, 0),
	(32, 1, 37, NULL, 1100.00, 'creada', '2024-10-23 15:00:00', '2024-10-24 11:00:00', '2024-10-15 19:32:19', 4, 0, NULL, 1, 0),
	(33, 3, 38, NULL, 985.00, 'pendiente', '2024-10-17 15:00:00', '2024-10-18 11:00:00', '2024-10-16 07:18:22', 3, 0, NULL, 0, 0),
	(34, 5, 39, NULL, 1150.00, 'creada', '2024-10-24 15:00:00', '2024-10-25 11:00:00', '2024-10-16 22:04:50', 2, 0, NULL, 1, 0);

-- Volcando estructura para tabla hotel.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.roles: ~0 rows (aproximadamente)
INSERT INTO `roles` (`id`, `nombre`) VALUES
	(1, 'ADMIN'),
	(2, 'CLIENTE');

-- Volcando estructura para vista hotel.rptfacturas
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `rptfacturas` (
	`id` INT(10) UNSIGNED NOT NULL,
	`fecha` DATE NULL,
	`numFactura` INT(11) NOT NULL,
	`nit` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`cliente` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`total` DOUBLE(19,2) NULL,
	`usuario` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`anulado` TINYINT(1) NULL,
	`autorizacionFel` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci'
) ENGINE=MyISAM;

-- Volcando estructura para vista hotel.rptgastos
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `rptgastos` (
	`id` INT(10) UNSIGNED NOT NULL,
	`fecha` DATE NOT NULL,
	`gasto` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`efectivo` DOUBLE(19,2) NULL,
	`tarjeta` DOUBLE(19,2) NULL,
	`transferencia` DOUBLE(19,2) NULL,
	`cheque` DOUBLE(19,2) NULL,
	`total` FLOAT(8,2) NOT NULL,
	`proveedor` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`tipogasto` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`usuario` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci'
) ENGINE=MyISAM;

-- Volcando estructura para vista hotel.rpthojavida
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `rpthojavida` (
	`id` INT(11) NOT NULL,
	`producto_id` INT(11) NOT NULL,
	`user_id` INT(11) NOT NULL,
	`fecha` DATE NULL,
	`fechaHora` DATETIME NOT NULL,
	`tipo` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`movimiento_id` INT(11) NOT NULL,
	`existenciaAnterior` FLOAT NOT NULL,
	`cantidad` FLOAT NOT NULL,
	`existenciaActual` FLOAT NOT NULL,
	`detalle` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`costo` FLOAT NOT NULL,
	`usuario` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci'
) ENGINE=MyISAM;

-- Volcando estructura para tabla hotel.tipogastos
CREATE TABLE IF NOT EXISTS `tipogastos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo` varchar(255) NOT NULL,
  `anulado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.tipogastos: ~0 rows (aproximadamente)
INSERT INTO `tipogastos` (`id`, `tipo`, `anulado`) VALUES
	(1, 'ENCOMIENDA', 0),
	(2, 'LIMPIEZA', 0);

-- Volcando estructura para vista hotel.transacciones_caja
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `transacciones_caja` (
	`fecha` DATETIME NULL,
	`tipo` VARCHAR(14) NULL COLLATE 'utf8mb4_general_ci',
	`razon` VARCHAR(255) NULL COLLATE 'latin1_swedish_ci',
	`documentoId` INT(10) UNSIGNED NULL,
	`totalEfectivo` DOUBLE(19,2) NULL,
	`totalTarjeta` DOUBLE(19,2) NULL,
	`totalTransferencia` DOUBLE(19,2) NULL,
	`totalCheque` DOUBLE(19,2) NULL,
	`total` DOUBLE(19,2) NULL,
	`apertura_id` INT(10) UNSIGNED NULL,
	`idReservacion` INT(10) UNSIGNED NULL,
	`reservacionPagada` VARCHAR(2) NULL COLLATE 'utf8mb4_general_ci',
	`anulado` TINYINT(4) NULL
) ENGINE=MyISAM;

-- Volcando estructura para tabla hotel.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int(10) unsigned DEFAULT NULL,
  `anulado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_email_unique` (`email`),
  KEY `usuarios_rol_id_foreign` (`rol_id`),
  CONSTRAINT `usuarios_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotel.usuarios: ~2 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `full_name`, `email`, `password`, `rol_id`, `anulado`) VALUES
	(1, 'HUGO RAUL LOPEZ ENRIQUEZ', 'hugo@gmail.com', '$scrypt$n=16384,r=8,p=1$bIQl4MppMEkSEKu3Vxql0A$+tjHXr7YbpoHLuUmQsqNKAAJW+t6qNuHdNHEOJPk5JCz+9ucw543CFCjNr9TLUsRlr1nVsgNOawFJsh8mqvQ5w', 1, 0),
	(2, 'MELISSA AYDARI GOMEZ', 'meli@gmail.com', '$scrypt$n=16384,r=8,p=1$zfxYvQCOR96n3SZ2yRTsvQ$2QSqNRolS4NfayEePFsz4nFLy8fO0Njzjyg2YHOnsD/BIKvsUixg7Yo+EYgpppIgajTF7VRwxwPuQwHktskMHQ', 2, 0);

-- Volcando estructura para vista hotel.vdetalle_hospedaje
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vdetalle_hospedaje` (
	`id` INT(10) UNSIGNED NOT NULL,
	`hospedaje_id` INT(10) UNSIGNED NULL,
	`producto_id` INT(10) UNSIGNED NULL,
	`cantidad` FLOAT(8,2) NOT NULL,
	`costo` FLOAT(8,2) NOT NULL,
	`precio_venta` FLOAT(8,2) NOT NULL,
	`descuento` FLOAT(8,2) NOT NULL,
	`subtotal` DOUBLE(19,2) NOT NULL,
	`pagado` TINYINT(1) NOT NULL,
	`descripcion` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`servicio` TINYINT(1) NOT NULL
) ENGINE=MyISAM;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `cajas`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `cajas` AS SELECT ap.id AS id_apertura,ar.id AS id_arqueo, ap.user_id, full_name AS usuario, ap.fecha AS fecha_apertura, ap.observaciones,
ap.monto, CASE WHEN ci.id IS NOT NULL THEN 'Cierre' WHEN ar.id IS NOT NULL THEN 'Arqueo' 
ELSE 'Apertura' END AS estado, ar.fecha AS fecha_arqueo,ar.monto AS monto_arqueo ,ap.anulado,
ci.fecha AS fecha_cierre, ci.monto_sistema , CASE 
        WHEN EXISTS (SELECT 1 FROM cierre_caja ci_sub WHERE ci_sub.arqueo_id = ar.id AND ci_sub.anulado=0) THEN 1 
        ELSE 0 
    END AS existe_cierre,
ci.observaciones AS observacionesCierre,
CASE WHEN EXISTS (SELECT 1 FROM arqueo_caja ar_sub WHERE ar_sub.apertura_id = ap.id AND ar_sub.anulado=0) AND ap.anulado=0 THEN 1 
   ELSE 0 
END AS aplicaCierre
FROM apertura_caja ap
LEFT JOIN arqueo_caja ar ON ap.id = ar.apertura_id
LEFT JOIN cierre_caja ci ON ar.id = ci.arqueo_id
LEFT JOIN usuarios u 	 ON ap.user_id = u.id ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `rptfacturas`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `rptfacturas` AS SELECT f.id, DATE(f.fecha_registro) AS fecha, f.num_factura AS numFactura, f.nit, f.nombre_facturado AS cliente, 
SUM((d.cantidad * d.precio_venta) - d.descuento) AS total, u.full_name AS usuario,
f.anulado, f.autorizacion_fel AS autorizacionFel
FROM facturas f 
INNER JOIN detalle_facturas d ON f.id = d.factura_id
INNER JOIN usuarios u ON u.id = f.user_id
GROUP BY f.id, f.fecha_registro, f.num_factura, f.nit, f.nombre_facturado, u.full_name, f.anulado, f.autorizacion_fel ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `rptgastos`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `rptgastos` AS SELECT 
    g.id, 
    g.fecha, 
    g.descripcion AS gasto, 
    SUM(CASE WHEN op.metodo = 'EFE' THEN op.monto ELSE 0 END) AS efectivo,
    SUM(CASE WHEN op.metodo = 'TAR' THEN op.monto ELSE 0 END) AS tarjeta,
    SUM(CASE WHEN op.metodo = 'TRA' THEN op.monto ELSE 0 END) AS transferencia,
    SUM(CASE WHEN op.metodo = 'CHE' THEN op.monto ELSE 0 END) AS cheque,
    g.monto AS total,
    p.nombre AS proveedor,
    t.tipo AS tipogasto, 
    u.full_name AS usuario
FROM 
    gastos g 
INNER JOIN 
    proveedores p ON p.id = g.proveedor_id
INNER JOIN 
    tipogastos t ON t.id = g.tipo_gasto_id
INNER JOIN 
    usuarios u ON u.id = g.user_id 
INNER JOIN 
    opciones_pagos op ON g.id = op.documento_id
WHERE 
    op.tipo_documento = 'FG' 
    AND g.anulado = 0 
GROUP BY 
    g.id, 
    g.fecha, 
    g.descripcion, 
    g.monto,
    p.nombre, 
    t.tipo, 
    u.full_name ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `rpthojavida`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `rpthojavida` AS SELECT hv.id, hv.producto_id, hv.user_id, DATE(hv.fecha) AS fecha, hv.fecha AS fechaHora, hv.tipo, hv.movimiento_id,
hv.existencia_anterior AS existenciaAnterior, hv.cantidad, hv.existencia_actual AS existenciaActual, hv.detalle, hv.costo,
 u.full_name AS usuario
  FROM hoja_vida_productos hv
INNER JOIN usuarios u ON u.id=hv.user_id ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `transacciones_caja`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `transacciones_caja` AS SELECT 
  CASE pd.tipo_documento WHEN 'FH' THEN f.fecha_registro
  WHEN 'FG' THEN g.fecha
  END AS fecha, 
  CASE pd.tipo_documento WHEN 'FH' THEN 'FACT HOSPEDAJE'
  WHEN 'FG' THEN 'FACT GASTO'
  WHEN 'R' THEN 'RESERVACION'
  WHEN 'FC' THEN 'FACT COMPRA'
  END AS tipo,
  CASE pd.tipo_documento WHEN 'FH' THEN f.nombre_facturado
  WHEN 'FG' THEN p.nombre
  END AS razon,
  COALESCE(h.id, f.id, g.id) AS documentoId, -- El id del hospedaje, factura o gasto
  SUM(CASE WHEN pd.metodo = 'EFE' THEN pd.monto ELSE 0 END) AS totalEfectivo,
  SUM(CASE WHEN pd.metodo = 'TAR' THEN pd.monto ELSE 0 END) AS totalTarjeta,
  SUM(CASE WHEN pd.metodo = 'TRA' THEN pd.monto ELSE 0 END) AS totalTransferencia,
  SUM(CASE WHEN pd.metodo = 'CHE' THEN pd.monto ELSE 0 END) AS totalCheque,
  SUM(pd.monto) AS total,
  pd.apertura_id,
  COALESCE(r.id, h.reservacion_id) AS idReservacion,   
  CASE 
    WHEN r.pagado = 1 OR h.reservacion_id IS NOT NULL AND EXISTS (SELECT 1 FROM reservaciones r2 WHERE r2.id = h.reservacion_id AND r2.pagado = 1) 
    THEN 'Sí' ELSE 'No' 
  END AS reservacionPagada, 
  CASE pd.tipo_documento WHEN 'FH' THEN f.anulado
  WHEN 'FG' THEN g.anulado
  END AS anulado
FROM opciones_pagos pd
LEFT JOIN hospedajes h ON pd.tipo_documento = 'H' AND pd.documento_id = h.id
LEFT JOIN facturas f ON pd.tipo_documento = 'FH' AND pd.documento_id = f.num_factura
LEFT JOIN gastos g ON pd.tipo_documento = 'FG' AND pd.documento_id = g.id
LEFT JOIN proveedores p ON g.proveedor_id = p.id
LEFT JOIN reservaciones r ON pd.tipo_documento = 'R' AND pd.documento_id = r.id

GROUP BY pd.tipo_documento, pd.documento_id, pd.apertura_id ;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vdetalle_hospedaje`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vdetalle_hospedaje` AS SELECT d.id, hospedaje_id, producto_id, cantidad, d.costo, d.precio_venta, d.descuento, 
	(d.cantidad * d.precio_venta) -d.descuento AS subtotal ,d.pagado, p.nombre AS descripcion, p.es_servicio AS servicio
 	FROM detalle_hospedajes  d
	INNER JOIN productos p ON d.producto_id = p.id ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
