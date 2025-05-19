-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 19, 2025 at 11:39 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_resepkita`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`) VALUES
(1, 'admin_rina', 'rina@admin', 'password'),
(2, 'admin_budi', 'budi@admin', 'password');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `recipe_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int NOT NULL,
  `recipe_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `recipe_id`, `name`) VALUES
(1, 1, 'Kacang panjang'),
(2, 1, 'Melinjo'),
(3, 1, 'Jagung manis'),
(4, 1, 'Asam Jawa'),
(5, 1, 'Bawang merah'),
(6, 1, 'Garam'),
(7, 1, 'Gula merah'),
(8, 1, 'Air'),
(9, 2, 'Dada ayam'),
(10, 2, 'Tepung bumbu'),
(11, 2, 'Cabai hijau'),
(12, 2, 'Tomat hijau'),
(13, 2, 'Garam'),
(14, 2, 'Minyak goreng'),
(15, 2, 'Bawang putih'),
(16, 3, 'Nasi putih'),
(17, 3, 'Kecap manis'),
(18, 3, 'Bawang putih'),
(19, 3, 'Telur'),
(20, 3, 'Garam'),
(21, 3, 'Minyak goreng'),
(22, 4, 'Ayam suwir'),
(23, 4, 'Koya'),
(24, 4, 'Daun bawang'),
(25, 4, 'Bawang goreng'),
(26, 4, 'Kaldu bubuk'),
(27, 5, 'Daging sapi'),
(28, 5, 'Santan'),
(29, 5, 'Cabe merah kering'),
(30, 5, 'Serai'),
(31, 5, 'Daun jeruk'),
(32, 6, 'Tauge'),
(33, 6, 'Kacang panjang'),
(34, 6, 'Kentang'),
(35, 6, 'Kacang tanah'),
(36, 6, 'Bumbu kacang'),
(37, 7, 'Bakso sapi'),
(38, 7, 'Iga sapi'),
(39, 7, 'Bawang putih'),
(40, 7, 'Seledri'),
(41, 7, 'Mie kuning'),
(42, 8, 'Ikan kembung'),
(43, 8, 'Daun kemangi'),
(44, 8, 'Cabe rawit'),
(45, 8, 'Bawang merah'),
(46, 8, 'Daun pisang'),
(47, 9, 'Tepung terigu'),
(48, 9, 'Susu kental manis'),
(49, 9, 'Gula pasir'),
(50, 9, 'Dark chocolate'),
(51, 9, 'Keju parut'),
(52, 10, 'Buntut sapi'),
(53, 10, 'Wortel'),
(54, 10, 'Seledri'),
(55, 10, 'Bawang bombay'),
(56, 10, 'Santan kental'),
(57, 11, 'Tepung maizena'),
(58, 11, 'Kuning telur'),
(59, 11, 'Gula halus'),
(60, 11, 'Margarin'),
(61, 11, 'Vanili'),
(62, 12, 'Durian montong'),
(63, 12, 'Garam'),
(64, 12, 'Cabe rawit'),
(65, 12, 'Bawang putih'),
(66, 12, 'Air'),
(67, 13, 'Tahu pong'),
(68, 13, 'Bawang putih goreng'),
(69, 13, 'Kecap manis'),
(70, 13, 'Cabe rawit'),
(71, 13, 'Gula merah'),
(72, 14, 'Ikan lele'),
(73, 14, 'Terasi'),
(74, 14, 'Tomat'),
(75, 14, 'Jeruk nipis'),
(76, 14, 'Minyak goreng'),
(77, 15, 'Cumi segar'),
(78, 15, 'Cabe merah'),
(79, 15, 'Saos tomat'),
(80, 15, 'Bawang bombay'),
(81, 15, 'Garam'),
(82, 16, 'Pisang kepok'),
(83, 16, 'Keju cheddar'),
(84, 16, 'Cokelat meses'),
(85, 16, 'Margarin'),
(86, 16, 'Tepung roti'),
(87, 17, 'Dada ayam'),
(88, 17, 'Cabe rawit'),
(89, 17, 'Jeruk nipis'),
(90, 17, 'Garam'),
(91, 17, 'Tusuk sate'),
(92, 18, 'Mangga'),
(93, 18, 'Nanas'),
(94, 18, 'Kedondong'),
(95, 18, 'Gula merah'),
(96, 18, 'Terasi'),
(97, 19, 'Nasi putih'),
(98, 19, 'Telur'),
(99, 19, 'Daun bawang'),
(100, 19, 'Kecap asin'),
(101, 19, 'Minyak wijen'),
(102, 20, 'Mie telur'),
(103, 20, 'Kecap manis'),
(104, 20, 'Cabe rawit'),
(105, 20, 'Bawang putih'),
(106, 20, 'Sayur kubis'),
(107, 21, 'Ketan putih'),
(108, 21, 'Telur ayam'),
(109, 21, 'Ebi kering'),
(110, 21, 'Garam'),
(111, 21, 'Minyak kelapa'),
(112, 22, 'Lontong'),
(113, 22, 'Labu siam'),
(114, 22, 'Santan'),
(115, 22, 'Cabe merah'),
(116, 22, 'Daun salam'),
(117, 23, 'Laksan'),
(118, 23, 'Santan'),
(119, 23, 'Cabe rawit'),
(120, 23, 'Tauge'),
(121, 23, 'Jeruk nipis'),
(122, 24, 'Beras'),
(123, 24, 'Ayam suwir'),
(124, 24, 'Cakwe'),
(125, 24, 'Kecap asin'),
(126, 24, 'Daun bawang'),
(127, 25, 'Buah naga'),
(128, 25, 'Cincau'),
(129, 25, 'Agar‑agar'),
(130, 25, 'Susu kental'),
(131, 25, 'Sirup merah');

-- --------------------------------------------------------

--
-- Table structure for table `instructions`
--

CREATE TABLE `instructions` (
  `id` int NOT NULL,
  `recipe_id` int DEFAULT NULL,
  `step_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `instructions`
--

INSERT INTO `instructions` (`id`, `recipe_id`, `step_description`) VALUES
(1, 1, 'Rebus air hingga mendidih.'),
(2, 1, 'Masukkan bawang merah dan bumbu lainnya.'),
(3, 1, 'Tambahkan sayuran secara bertahap.'),
(4, 1, 'Masak hingga sayur matang.'),
(5, 2, 'Goreng ayam dengan tepung hingga kecokelatan.'),
(6, 2, 'Ulek cabai, bawang, dan tomat.'),
(7, 2, 'Tumis sambal sebentar.'),
(8, 2, 'Geprek ayam dengan sambal.'),
(9, 3, 'Tumis bawang putih hingga harum.'),
(10, 3, 'Masukkan telur, orak-arik.'),
(11, 3, 'Tambahkan nasi dan kecap.'),
(12, 3, 'Aduk rata dan sajikan.'),
(13, 4, 'Rebus ayam hingga empuk lalu suwir.'),
(14, 4, 'Tumis bumbu, masukkan ayam dan air kaldu.'),
(15, 4, 'Tabur koya dan bawang goreng.'),
(16, 4, 'Sajikan hangat.'),
(17, 5, 'Haluskan bumbu, tumis hingga wangi.'),
(18, 5, 'Masukkan daging dan santan, masak pelan.'),
(19, 5, 'Aduk terus sampai mengental.'),
(20, 5, 'Angkat, sajikan.'),
(21, 6, 'Rebus sayuran sebentar.'),
(22, 6, 'Haluskan kacang dan bumbu.'),
(23, 6, 'Siram sayur dengan bumbu kacang.'),
(24, 6, 'Tabur bawang goreng.'),
(25, 7, 'Rebus iga hingga kaldunya keluar.'),
(26, 7, 'Tambahkan bakso dan mie, masak sebentar.'),
(27, 7, 'Bumbui garam dan merica.'),
(28, 7, 'Tabur seledri.'),
(29, 8, 'Lumuri ikan dengan bumbu, bungkus daun pisang.'),
(30, 8, 'Kukus 20 menit.'),
(31, 8, 'Bakar sebentar atas bara.'),
(32, 8, 'Sajikan dengan lalapan.'),
(33, 9, 'Campur semua adonan, cetak di teflon.'),
(34, 9, 'Panggang, bolak‑balik tiap lapis.'),
(35, 9, 'Oles margarin tiap lapis.'),
(36, 9, 'Tabur topping.'),
(37, 10, 'Rebus buntut hingga empuk.'),
(38, 10, 'Tumis bumbu, masukkan buntut dan santan.'),
(39, 10, 'Masak hingga empuk dan bumbu meresap.'),
(40, 10, 'Sajikan dengan nasi.'),
(41, 11, 'Campur kuning telur, maizena, gula.'),
(42, 11, 'Tuang tipis di loyang, kukus tiap lapis.'),
(43, 11, 'Ulang hingga adonan habis.'),
(44, 11, 'Dinginkan sebelum potong.'),
(45, 12, 'Tiriskan durian, haluskan dengan garam.'),
(46, 12, 'Tumis bumbu hingga harum.'),
(47, 12, 'Masukkan durian, masak asam manis.'),
(48, 12, 'Angkat dan sajikan.'),
(49, 13, 'Potong tahu, goreng hingga kering.'),
(50, 13, 'Campur kecap, gula, air.'),
(51, 13, 'Siram tahu, tabur bawang goreng.'),
(52, 13, 'Sajikan hangat.'),
(53, 14, 'Lumuri lele dengan air jeruk dan garam.'),
(54, 14, 'Goreng hingga garing.'),
(55, 14, 'Haluskan terasi, tomat, cabe.'),
(56, 14, 'Sajikan lele dengan sambal.'),
(57, 15, 'Bersihkan cumi, potong cincin.'),
(58, 15, 'Tumis bawang, masukkan cumi.'),
(59, 15, 'Tambahkan saus tomat dan cabe.'),
(60, 15, 'Masak hingga bumbu meresap.'),
(61, 16, 'Iris pisang, celup ke tepung roti.'),
(62, 16, 'Goreng hingga kecokelatan.'),
(63, 16, 'Tabur keju dan meses.'),
(64, 16, 'Sajikan hangat.'),
(65, 17, 'Tusuk dadu ayam, taburi garam.'),
(66, 17, 'Bakar, oles jeruk nipis.'),
(67, 17, 'Sajikan dengan irisan cabe rawit.'),
(68, 17, 'Nikmati selagi hangat.'),
(69, 18, 'Potong buah, campur gula merah cair.'),
(70, 18, 'Tambahkan terasi sedikit.'),
(71, 18, 'Aduk rata, koreksi rasa.'),
(72, 18, 'Sajikan dingin dengan es.'),
(73, 19, 'Panaskan minyak, orak-arik telur.'),
(74, 19, 'Masukkan nasi dan kecap asin.'),
(75, 19, 'Tabur daun bawang.'),
(76, 19, 'Angkat, sajikan.'),
(77, 20, 'Tumis bawang putih, masukkan mie.'),
(78, 20, 'Tambahkan kecap dan cabe.'),
(79, 20, 'Aduk sayur kubis.'),
(80, 20, 'Sajikan panas.'),
(81, 21, 'Campur ketan, tumis dengan telur.'),
(82, 21, 'Ratakan, tabur ebi.'),
(83, 21, 'Goreng dengan minyak kelapa.'),
(84, 21, 'Angkat dan sajikan.'),
(85, 22, 'Rebus santan dengan bumbu.'),
(86, 22, 'Masukkan labu dan lontong.'),
(87, 22, 'Masak hingga kuah mengental.'),
(88, 22, 'Sajikan hangat.'),
(89, 23, 'Rebus laksan dalam santan pedas.'),
(90, 23, 'Tambahkan tauge.'),
(91, 23, 'Peras jeruk nipis di atasnya.'),
(92, 23, 'Nikmati hangat.'),
(93, 24, 'Rebus beras jadi bubur.'),
(94, 24, 'Masukkan ayam suwir.'),
(95, 24, 'Tabur cakwe dan daun bawang.'),
(96, 24, 'Tambahkan kecap sesuai selera.'),
(97, 25, 'Potong dan susun buah.'),
(98, 25, 'Tambahkan cincau dan agar-agar.'),
(99, 25, 'Tuang susu dan sirup.'),
(100, 25, 'Aduk dan sajikan dingin.');

-- --------------------------------------------------------

--
-- Table structure for table `instruction_photos`
--

CREATE TABLE `instruction_photos` (
  `id` int NOT NULL,
  `instruction_id` int DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `instruction_photos`
--

INSERT INTO `instruction_photos` (`id`, `instruction_id`, `photo_url`) VALUES
(1, 1, 'instruksi1-1.jpg'),
(2, 2, 'instruksi1-2.jpg'),
(3, 3, 'instruksi1-3.jpg'),
(4, 4, 'instruksi1-4.jpg'),
(5, 5, 'instruksi2-1.jpg'),
(6, 6, 'instruksi2-2.jpg'),
(7, 7, 'instruksi2-3.jpg'),
(8, 8, 'instruksi2-4.jpg'),
(9, 9, 'instruksi3-1.jpg'),
(10, 10, 'instruksi3-2.jpg'),
(11, 11, 'instruksi3-3.jpg'),
(12, 12, 'instruksi3-4.jpg'),
(13, 13, 'i4-1.jpg'),
(14, 14, 'i4-2.jpg'),
(15, 15, 'i4-3.jpg'),
(16, 16, 'i4-4.jpg'),
(17, 17, 'i5-1.jpg'),
(18, 18, 'i5-2.jpg'),
(19, 19, 'i5-3.jpg'),
(20, 20, 'i5-4.jpg'),
(21, 21, 'i6-1.jpg'),
(22, 22, 'i6-2.jpg'),
(23, 23, 'i6-3.jpg'),
(24, 24, 'i6-4.jpg'),
(25, 25, 'i7-1.jpg'),
(26, 26, 'i7-2.jpg'),
(27, 27, 'i7-3.jpg'),
(28, 28, 'i7-4.jpg'),
(29, 29, 'i8-1.jpg'),
(30, 30, 'i8-2.jpg'),
(31, 31, 'i8-3.jpg'),
(32, 32, 'i8-4.jpg'),
(33, 33, 'i9-1.jpg'),
(34, 34, 'i9-2.jpg'),
(35, 35, 'i9-3.jpg'),
(36, 36, 'i9-4.jpg'),
(37, 37, 'i10-1.jpg'),
(38, 38, 'i10-2.jpg'),
(39, 39, 'i10-3.jpg'),
(40, 40, 'i10-4.jpg'),
(41, 41, 'i11-1.jpg'),
(42, 42, 'i11-2.jpg'),
(43, 43, 'i11-3.jpg'),
(44, 44, 'i11-4.jpg'),
(45, 45, 'i12-1.jpg'),
(46, 46, 'i12-2.jpg'),
(47, 47, 'i12-3.jpg'),
(48, 48, 'i12-4.jpg'),
(49, 49, 'i13-1.jpg'),
(50, 50, 'i13-2.jpg'),
(51, 51, 'i13-3.jpg'),
(52, 52, 'i13-4.jpg'),
(53, 53, 'i14-1.jpg'),
(54, 54, 'i14-2.jpg'),
(55, 55, 'i14-3.jpg'),
(56, 56, 'i14-4.jpg'),
(57, 57, 'i15-1.jpg'),
(58, 58, 'i15-2.jpg'),
(59, 59, 'i15-3.jpg'),
(60, 60, 'i15-4.jpg'),
(61, 61, 'i16-1.jpg'),
(62, 62, 'i16-2.jpg'),
(63, 63, 'i16-3.jpg'),
(64, 64, 'i16-4.jpg'),
(65, 65, 'i17-1.jpg'),
(66, 66, 'i17-2.jpg'),
(67, 67, 'i17-3.jpg'),
(68, 68, 'i17-4.jpg'),
(69, 69, 'i18-1.jpg'),
(70, 70, 'i18-2.jpg'),
(71, 71, 'i18-3.jpg'),
(72, 72, 'i18-4.jpg'),
(73, 73, 'i19-1.jpg'),
(74, 74, 'i19-2.jpg'),
(75, 75, 'i19-3.jpg'),
(76, 76, 'i19-4.jpg'),
(77, 77, 'i20-1.jpg'),
(78, 78, 'i20-2.jpg'),
(79, 79, 'i20-3.jpg'),
(80, 80, 'i20-4.jpg'),
(81, 81, 'i21-1.jpg'),
(82, 82, 'i21-2.jpg'),
(83, 83, 'i21-3.jpg'),
(84, 84, 'i21-4.jpg'),
(85, 85, 'i22-1.jpg'),
(86, 86, 'i22-2.jpg'),
(87, 87, 'i22-3.jpg'),
(88, 88, 'i22-4.jpg'),
(89, 89, 'i23-1.jpg'),
(90, 90, 'i23-2.jpg'),
(91, 91, 'i23-3.jpg'),
(92, 92, 'i23-4.jpg'),
(93, 93, 'i24-1.jpg'),
(94, 94, 'i24-2.jpg'),
(95, 95, 'i24-3.jpg'),
(96, 96, 'i24-4.jpg'),
(97, 97, 'i25-1.jpg'),
(98, 98, 'i25-2.jpg'),
(99, 99, 'i25-3.jpg'),
(100, 100, 'i25-4.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `portion` int DEFAULT NULL,
  `cooking_time` int DEFAULT NULL,
  `status` enum('process','approved','rejected') DEFAULT NULL,
  `admin_comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `user_id`, `admin_id`, `title`, `description`, `portion`, `cooking_time`, `status`, `admin_comment`) VALUES
(1, 1, 1, 'Sayur Asem Betawi', 'Sayur asem khas Betawi dengan rasa segar dan sedikit asam.', 4, 30, 'approved', 'Sudah sesuai dengan resep tradisional.'),
(2, 2, 2, 'Ayam Geprek Sambal Ijo', 'Ayam goreng tepung dengan sambal ijo super pedas.', 2, 25, 'approved', 'Cocok untuk pecinta pedas.'),
(3, 3, 1, 'Nasi Goreng Kecap Sederhana', 'Menu praktis dengan bumbu sederhana yang cocok untuk sarapan.', 1, 15, 'approved', 'Sudah oke dan mudah diikuti.'),
(4, 1, 1, 'Soto Ayam Lamongan', 'Soto ayam bening khas Lamongan dengan koya gurih.', 4, 45, 'approved', 'Mantap, bumbunya meresap.'),
(5, 1, 1, 'Rendang Daging Padang', 'Rendang empuk, pedas, dan harum rempah.', 6, 240, 'approved', 'Perlu waktu lama, tapi hasilnya maksimal.'),
(6, 1, 1, 'Gado‑Gado Surabaya', 'Sayuran rebus dengan bumbu kacang kental.', 3, 20, 'approved', 'Saus kacang pas teksturnya.'),
(7, 1, 1, 'Bakso Kuah Iga', 'Kuah bakso kaya kaldu iga sapi.', 5, 60, 'approved', 'Kuahnya sangat gurih.'),
(8, 1, 1, 'Pepes Ikan Kembung', 'Ikan dibungkus daun pisang, dibumbui pedas.', 2, 35, 'approved', 'Aromanya wangi daun pisang.'),
(9, 1, 1, 'Martabak Manis Cokelat Keju', 'Martabak tebal lembut dengan topping lengkap.', 4, 50, 'approved', 'Tekstur penuh, topping melimpah.'),
(10, 1, 1, 'Sop Buntut Sapi', 'Buntut sapi empuk dengan kuah bening segar.', 4, 120, 'approved', 'Buntutnya empuk sekali.'),
(11, 1, 1, 'Kue Lapis Legit', 'Kue lapis dengan lapisan tipis dan legit.', 1, 180, 'approved', 'Butuh kesabaran, hasilnya harum.'),
(12, 2, 2, 'Sambal Tempoyak', 'Sambal pedas asam dari durian fermentasi.', 2, 15, 'approved', 'Pedasnya pas.'),
(13, 2, 2, 'Tahu Gejrot', 'Tahu goreng dipotong kecil dengan kuah manis pedas.', 3, 20, 'approved', 'Kuahnya ringan, pas.'),
(14, 2, 2, 'Pecel Lele Sambal Terasi', 'Lele goreng garing dengan sambal terasi.', 2, 30, 'approved', 'Garingnya tahan lama.'),
(15, 2, 2, 'Cumi Asam Manis', 'Cumi tumis saus asam manis pedas.', 3, 25, 'approved', 'Tekstur cumi kenyal dan lembut.'),
(16, 2, 2, 'Pisang Goreng Keju', 'Pisang kepok goreng renyah dengan topping keju.', 4, 25, 'approved', 'Renyaaaaah!'),
(17, 2, 2, 'Sate Taichan', 'Sate ayam tanpa bumbu kacang, pedas lemon.', 3, 20, 'approved', 'Asam pedasnya nendang.'),
(18, 2, 2, 'Rujak Buah Sehat', 'Mix buah segar dengan cocolan bumbu rujak.', 4, 15, 'approved', 'Segar dan manis pedas.'),
(19, 3, 1, 'Omelet Nasi ala Korea', 'Orak-arik nasi dengan telur ala Korean fried rice.', 1, 15, 'approved', 'Cepat dan praktis.'),
(20, 3, 1, 'Mie Goreng Jawa', 'Mie goreng manis pedas ala Jawa.', 2, 20, 'approved', 'Manis legit, pedas ringan.'),
(21, 3, 1, 'Kerak Telor Betawi', 'Camilan telur dan ketan dengan taburan ebi.', 2, 45, 'approved', 'Kriuknya khas.'),
(22, 3, 1, 'Lontong Sayur Padang', 'Sayur santan pedas dengan lontong.', 3, 60, 'approved', 'Santannya gurih.'),
(23, 3, 1, 'Laksa Medan', 'Laksan dalam kuah santan pedas.', 3, 40, 'approved', 'Pedasnya lembut.'),
(24, 3, 1, 'Bubur Ayam Spesial', 'Bubur ayam suwir dengan cakwe dan sambal.', 1, 30, 'approved', 'Komplit dan hangat.'),
(25, 3, 1, 'Es Campur Segar', 'Campuran buah, cincau, agar-agar, susu.', 4, 10, 'approved', 'Minuman segar favorit.');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_photos`
--

CREATE TABLE `recipe_photos` (
  `id` int NOT NULL,
  `recipe_id` int DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipe_photos`
--

INSERT INTO `recipe_photos` (`id`, `recipe_id`, `photo_url`) VALUES
(1, 1, 'sayur_asem.jpg'),
(2, 2, 'ayam_geprek_ijo.jpg'),
(3, 3, 'nasi_goreng_kecap.jpg'),
(4, 4, 'soto_lamongan.jpg'),
(5, 5, 'rendang_padang.jpg'),
(6, 6, 'gado_gado_surabaya.jpg'),
(7, 7, 'bakso_kuah_iga.jpg'),
(8, 8, 'pepes_ikan.jpg'),
(9, 9, 'martabak_manis.jpg'),
(10, 10, 'sop_buntut.jpg'),
(11, 11, 'kue_lapis_legit.jpg'),
(12, 12, 'sambal_tempoyak.jpg'),
(13, 13, 'tahu_gejrot.jpg'),
(14, 14, 'pecel_lele.jpg'),
(15, 15, 'cumi_asam_manis.jpg'),
(16, 16, 'pisang_goreng_keju.jpg'),
(17, 17, 'sate_taichan.jpg'),
(18, 18, 'rujak_buah.jpg'),
(19, 19, 'omelet_nasi.jpg'),
(20, 20, 'mie_goreng_jawa.jpg'),
(21, 21, 'kerak_telor.jpg'),
(22, 22, 'lontong_sayur.jpg'),
(23, 23, 'laksa_medan.jpg'),
(24, 24, 'bubur_ayam.jpg'),
(25, 25, 'es_campur.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `recipe_id` int DEFAULT NULL,
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonial_photos`
--

CREATE TABLE `testimonial_photos` (
  `id` int NOT NULL,
  `testimonial_id` int DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `photo_profile` varchar(255) DEFAULT NULL,
  `bio` text,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `nickname`, `photo_profile`, `bio`, `email`, `password`) VALUES
(1, 'warteg_lezat', 'Dian', 'foto1.jpg', 'Pencinta masakan rumahan tradisional.', 'dian@kuliner.id', 'password'),
(2, 'sambelmania', 'Rafi', 'foto2.jpg', 'Saya suka bereksperimen dengan sambal.', 'rafi@sambel.id', 'password'),
(3, 'nasi_kucing88', 'Tari', 'foto3.jpg', 'Penggemar masakan sederhana dan praktis.', 'tari@nasi.id', 'password');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `instructions`
--
ALTER TABLE `instructions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `instruction_photos`
--
ALTER TABLE `instruction_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instruction_id` (`instruction_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `recipe_photos`
--
ALTER TABLE `recipe_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `testimonial_photos`
--
ALTER TABLE `testimonial_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `testimonial_id` (`testimonial_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `instructions`
--
ALTER TABLE `instructions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `instruction_photos`
--
ALTER TABLE `instruction_photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `recipe_photos`
--
ALTER TABLE `recipe_photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `testimonial_photos`
--
ALTER TABLE `testimonial_photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `instructions`
--
ALTER TABLE `instructions`
  ADD CONSTRAINT `instructions_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `instruction_photos`
--
ALTER TABLE `instruction_photos`
  ADD CONSTRAINT `instruction_photos_ibfk_1` FOREIGN KEY (`instruction_id`) REFERENCES `instructions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipe_photos`
--
ALTER TABLE `recipe_photos`
  ADD CONSTRAINT `recipe_photos_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `testimonials_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `testimonial_photos`
--
ALTER TABLE `testimonial_photos`
  ADD CONSTRAINT `testimonial_photos_ibfk_1` FOREIGN KEY (`testimonial_id`) REFERENCES `testimonials` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
